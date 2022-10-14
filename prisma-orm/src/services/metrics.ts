import { PrismaClient } from '@prisma/client';

export class MetricsService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const metrics = await this.prisma.metric.findMany();

    const map = new Map();
    for (const el of metrics) {
      const counter = map.get(el.query);
      map.set(el.type, counter ? counter + 1 : 1);
    }

    const info = {
      count: metrics.length || 0,
      select: map.get('SELECT') || 0,
      where: map.get('WHERE') || 0,
      join: map.get('JOIN') || 0,
      metrics: metrics.map((item) => ({ query: item.query, ms: item.ms, createdAt: item.createdAt })),
    };
    return info;
  }
}
