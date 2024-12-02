import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, customer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async createCustomer(data: CreateCustomerDto): Promise<customer> {
    try {
      return await this.prisma.customer.create({
        data: {
          store_id: data.store_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          address_id: data.address_id,
          activebool: data.activebool ?? true,
          active: data.active,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Customer already exists');
        }
        if (error.code === 'P2003') {
          throw new ConflictException('Invalid store or address');
        }
      }
      throw error;
    }
  }

  async updateCustomer(id: number, data: UpdateCustomerDto): Promise<customer> {
    try {
      return await this.prisma.customer.update({
        where: { customer_id: id },
        data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Customer not found');
        }
        if (error.code === 'P2003') {
          throw new ConflictException('Invalid store or address');
        }
      }
      throw error;
    }
  }

  async getCustomers(): Promise<Partial<customer>[]> {
    return this.prisma.customer.findMany({
      select: {
        customer_id: true,
        first_name: true,
        last_name: true,
        email: true,
        activebool: true,
      },
    });
  }

  async getCustomerById(id: number): Promise<customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { customer_id: id },
      include: {
        address: true,
        store: true,
        payment: {
          take: 5,
          orderBy: { payment_date: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      await this.prisma.customer.delete({
        where: { customer_id: id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Customer not found');
        }
      }
      throw error;
    }
  }
}
