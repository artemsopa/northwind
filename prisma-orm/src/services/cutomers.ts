import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/error';

export class CustomersService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.customer.findMany();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));

    return customers;
  }

  async getInfo(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!customer) throw ApiError.badRequest('Unknown customer!');

    return customer;
  }

  async search(company: string) {
    const data = await this.prisma.customer.findMany({
      where: {
        companyName: {
          contains: company,
          mode: 'insensitive',
        },
      },
    });

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return customers;
  }
}
