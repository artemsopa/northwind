import { Metric } from './entities/metrics';
import { Database } from './entities/schema';

export class MetricsRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll(): Promise<Metric[]> {
    return await this.db.metrics.select().execute();
  }
}
