import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto, UpdateRentalDto } from './rental.dto';

@Injectable()
export class RentalService {
  constructor(private prisma: PrismaService) {}

  async createRental(data: CreateRentalDto) {
    const customerDateTime = new Date(data.rental_date);

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: data.timezone,
      });
      formatter.format(customerDateTime);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestException('Invalid timezone or date');
      }
    }

    const returnDate = new Date(customerDateTime);
    returnDate.setDate(returnDate.getDate() + data.rental_duration);

    return this.prisma.rental.create({
      data: {
        rental_date: customerDateTime,
        return_date: returnDate,
        inventory_id: data.inventory_id,
        customer_id: data.customer_id,
        staff_id: data.staff_id,
        timezone: data.timezone,
      },
      include: {
        inventory: {
          include: { film: true },
        },
      },
    });
  }

  async updateRental(id: number, data: UpdateRentalDto) {
    const rental = await this.prisma.rental.findUnique({
      where: { rental_id: id },
    });

    if (!rental) {
      throw new BadRequestException('Rental not found');
    }

    if (!rental.return_date || rental.return_date > new Date()) {
      throw new BadRequestException('Cannot modify an ongoing rental');
    }

    return this.prisma.rental.update({
      where: { rental_id: id },
      data,
    });
  }

  async getRentalsByCustomer(customerId: number) {
    return this.prisma.rental.findMany({
      where: { customer_id: customerId },
      include: {
        inventory: {
          include: {
            film: true,
          },
        },
      },
    });
  }

  async getRental(id: number) {
    return this.prisma.rental.findUnique({
      where: { rental_id: id },
      include: {
        inventory: {
          include: { film: true },
        },
        customer: true,
      },
    });
  }
}
