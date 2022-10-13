import { PrismaClient } from '@prisma/client';
import { ProductJoinSupplier } from '@/internal/repositories/types/types';

export class ProductsRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.product.findMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        supplier: true,
      },
    });

    return data as ProductJoinSupplier;
  }

  async search(name: string) {
    const data = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return data;
  }
}
