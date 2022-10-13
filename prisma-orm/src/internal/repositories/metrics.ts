import { PrismaClient } from '@prisma/client';

export class MetricsRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    return await this.prisma.metric.findMany();
  }
}
