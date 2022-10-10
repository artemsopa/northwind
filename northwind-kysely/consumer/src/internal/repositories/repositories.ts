import { Kysely } from 'kysely';
import Database, { MetricInput } from './types/types';
import MetricsRepo from './metrics.repo';

export interface IMetricsRepo {
  create(metric: MetricInput): Promise<void>;
}

export default class Repositories {
  metrics: IMetricsRepo;
  constructor(db: Kysely<Database>) {
    this.metrics = new MetricsRepo(db);
  }
}
