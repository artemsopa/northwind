import { PrismaClient } from '@prisma/client';

export class SuppliersRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.supplier.findMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    return data;
  }
}
