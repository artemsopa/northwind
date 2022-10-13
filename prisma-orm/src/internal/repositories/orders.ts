import { PrismaClient } from '@prisma/client';
import { DetailJoinProductJoinOrder, OrderJoinDetail } from '@/internal/repositories/types/types';

export class OrdersRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.order.findMany({
      include: {
        details: true,
      },
    });

    return data as OrderJoinDetail[];
  }

  async getInfo(id: string) {
    const data = await this.prisma.detail.findMany({
      where: {
        orderId: id,
      },
      include: {
        order: true,
        product: true,
      },
    });

    return data as DetailJoinProductJoinOrder[];
  }
}
