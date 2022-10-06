import { IMetricsRepo } from './repositories';
import { Metric } from './entities/metrics';
import { DataBase } from './entities/schema';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async getAll(): Promise<Metric[]> {
    return await this.db.metrics.select().execute();
  }
}

export default MetricsRepo;
