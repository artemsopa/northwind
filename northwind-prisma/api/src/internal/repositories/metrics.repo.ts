import { Metric, PrismaClient } from '@prisma/client';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Metric[]> {
    return await this.prisma.metric.findMany();
  }
}

export default MetricsRepo;
