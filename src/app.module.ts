import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { PrismaService } from './prisma/prisma.service';
import { RentalController } from './rental/rental.controller';
import { RentalService } from './rental/rental.service';
import { EmailService } from './notification/email/email.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    AppController,
    CustomerController,
    RentalController,
    NotificationController,
  ],
  providers: [
    AppService,
    PrismaService,
    CustomerService,
    RentalService,
    NotificationService,
    EmailService,
  ],
})
export class AppModule {}
