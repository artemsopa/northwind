import { DataBase, QType } from './entities/schema';
import MetricsRepo from './metrics.repo';

export interface IMetricsRepo {
  create(queryString: string, ms: number, queryType: QType): Promise<void>;
}

export default class Repositories {
  metrics: IMetricsRepo;
  constructor(db: DataBase) {
    this.metrics = new MetricsRepo(db);
  }
}
