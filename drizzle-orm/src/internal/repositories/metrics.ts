import { Database } from '@/internal/repositories/entities/schema';

export class MetricsRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    return await this.db.metrics.select().execute();
  }
}
