import { DataSource, Repository } from 'typeorm';
import { Metric } from '@/entities/metrics';

export class MetricsService {
  private readonly repo: Repository<Metric>;
  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Metric);
  }

  async getAll() {
    const metrics = await this.repo.find();

    const map = new Map();
    for (const el of metrics) {
      const counter = map.get(el.type);
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
