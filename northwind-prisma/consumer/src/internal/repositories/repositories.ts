import { PrismaClient, QueryType } from '@prisma/client';
import MetricsRepo from './metrics.repo';
import { MetricInput } from './types/metrics';

export interface IMetricsRepo {
  create(metric: MetricInput): Promise<void>;
  checkQueryType(query: string): Promise<QueryType> ;
}

export default class Repositories {
  metrics: IMetricsRepo;
  constructor(prisma: PrismaClient) {
    this.metrics = new MetricsRepo(prisma);
  }
}
