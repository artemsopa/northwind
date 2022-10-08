import { PrismaClient, QueryType } from '@prisma/client';
import { IMetricsRepo } from './repositories';
import { MetricInput } from './types/metrics';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(metric: MetricInput): Promise<void> {
    const data = await this.prisma.metric.create({
      data: metric,
    });
    console.log(data);
  }

  checkQueryType(query: string): Promise<QueryType> {
    query = query.toLowerCase();
    let type: QueryType;
    return new Promise<QueryType>((resolve, reject) => {
      if (query.includes('select')) type = QueryType.SELECT;
      if (query.includes('select') && query.includes('where')) type = QueryType.SELECT_WHERE;
      if (query.includes('select') && query.includes('left join')) type = QueryType.SELECT_LEFT_JOIN;
      if (query.includes('select') && query.includes('left join') && query.includes('where')) type = QueryType.SELECT_LEFT_JOIN_WHERE;
      type ? resolve(type) : reject(new Error('Unknown query type!'));
    });
  }
}

export default MetricsRepo;
