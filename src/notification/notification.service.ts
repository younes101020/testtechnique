import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email/email.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
    private emailService: EmailService,
  ) {}

  @Cron('0 12 * * *')
  async checkAndSendNotifications() {
    this.logger.log('Running rental return notifications check');
    const rentals = await this.prisma.rental.findMany({
      where: {
        return_date: { not: null },
        rental_date: { gte: new Date() },
      },
      include: {
        customer: true,
        inventory: {
          include: { film: true },
        },
      },
    });

    for (const rental of rentals) {
      const returnDate = new Date(rental.return_date);
      const now = new Date();
      const daysUntilReturn = Math.floor(
        (returnDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilReturn === 5 || daysUntilReturn === 3) {
        await this.sendNotification(rental, daysUntilReturn);
      }
    }
  }

  private async sendNotification(rental, daysRemaining: number) {
    const taskId = `notification-${rental.rental_id}-${Date.now()}`;
    const job = {
      id: taskId,
      status: 'pending',
      type: 'rental_reminder',
      data: {
        customerId: rental.customer_id,
        email: rental.customer.email,
        filmTitle: rental.inventory.film.title,
        returnDate: rental.return_date,
        daysRemaining,
      },
    };

    await this.prisma.notificationTask.create({ data: job });

    try {
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const content = `
        Return Reminder: ${rental.inventory.film.title}
        Due Date: ${dateFormatter.format(rental.return_date)}
        Days Remaining: ${daysRemaining}
      `;

      await this.emailService.sendEmail(
        rental.customer.email,
        `Rental Return Reminder - ${daysRemaining} days remaining`,
        content,
      );

      await this.prisma.notificationTask.update({
        where: { id: taskId },
        data: { status: 'completed' },
      });

      this.logger.log(`Notification sent for rental ${rental.rental_id}`);
    } catch (error) {
      await this.prisma.notificationTask.update({
        where: { id: taskId },
        data: { status: 'failed', data: { ...job.data, error: error.message } },
      });
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
  }

  async triggerManualNotification(rentalId: number) {
    const rental = await this.prisma.rental.findUnique({
      where: { rental_id: rentalId },
      include: {
        customer: true,
        inventory: {
          include: { film: true },
        },
      },
    });

    if (!rental) {
      throw new Error('Rental not found');
    }

    const daysUntilReturn = Math.floor(
      (rental.return_date.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );

    return this.sendNotification(rental, daysUntilReturn);
  }

  async getTaskStatus(taskId: string) {
    return this.prisma.notificationTask.findUnique({
      where: { id: taskId },
    });
  }

  async getAllTasks(filters?: {
    status?: string;
    type?: string;
    fromDate?: Date;
    toDate?: Date;
  }) {
    const where = {};
    if (filters?.status) where['status'] = filters.status;
    if (filters?.type) where['type'] = filters.type;
    if (filters?.fromDate || filters?.toDate) {
      where['createdAt'] = {
        ...(filters.fromDate && { gte: filters.fromDate }),
        ...(filters.toDate && { lte: filters.toDate }),
      };
    }

    return this.prisma.notificationTask.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
