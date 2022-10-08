import { Order, PrismaClient } from '@prisma/client';
import { IOrdersRepo } from './repositories';
import { DetailJoinProductJoinOrder, OrderJoinDetail } from './types/orders';

class OrdersRepo implements IOrdersRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<OrderJoinDetail[]> {
    const data = await this.prisma.order.findMany({
      include: {
        details: true,
      },
    });

    return data;
  }

  async getInfo(id: string): Promise<DetailJoinProductJoinOrder[]> {
    const data = await this.prisma.detail.findMany({
      where: {
        orderId: id,
      },
      include: {
        order: true,
        product: true,
      },
    });

    return data;
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.prisma.order.createMany({
      data: orders,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.order.deleteMany();
  }
}

export default OrdersRepo;
