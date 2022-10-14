import { Kysely } from 'kysely';
import { Database } from '@/dtos';

export class MetricsService {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const metrics = await this.db.selectFrom('metrics').selectAll().execute();

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
      metrics: metrics.map((item) => ({ query: item.query, ms: item.ms, createdAt: item.created_at })),
    };
    return info;
  }
}
