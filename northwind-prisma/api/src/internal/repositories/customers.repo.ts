import { Customer, PrismaClient } from '@prisma/client';
import { ICustomersRepo } from './repositories';

class CustomersRepo implements ICustomersRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Customer[]> {
    const data = await this.prisma.customer.findMany();

    return data;
  }

  async getInfo(id: string): Promise<Customer | null> {
    const data = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async search(company: string): Promise<Customer[]> {
    const data = await this.prisma.customer.findMany({
      where: {
        companyName: {
          contains: company,
          mode: 'insensitive',
        },
      },
    });

    return data;
  }

  async createMany(customers: Customer[]): Promise<void> {
    await this.prisma.customer.createMany({
      data: customers,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.customer.deleteMany();
  }
}

export default CustomersRepo;
