import { MetricsRepo } from '../repositories/metrics';

export class MetricsService {
  constructor(private readonly repo: MetricsRepo) {
    this.repo = repo;
  }

  async getAllMetrics() {
    const metrics = await this.repo.getAll();

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
