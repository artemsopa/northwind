import { Database } from '@/entities/schema';

export class MetricsService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const metrics = await this.db.metrics.select().execute();

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
