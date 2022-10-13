import { PrismaClient } from '@prisma/client';

export class CustomersRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.customer.findMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    });

    return data;
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

    return data;
  }
}
