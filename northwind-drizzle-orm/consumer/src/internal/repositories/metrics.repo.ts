import { DataBase, Metric, QType } from './entities/schema';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async create(queryString: string, ms: number, queryType: QType): Promise<void> {
    await this.db.metrics.insert({ queryString, ms, queryType }).execute();
  }
}

export default MetricsRepo;
