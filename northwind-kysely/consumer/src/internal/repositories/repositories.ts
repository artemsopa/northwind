import { Knex } from 'knex';
import { MetricInput } from './entities/metric';
import MetricsRepo from './metrics.repo';

export interface IMetricsRepo {
  create(metric: MetricInput): Promise<void>;
}

export default class Repositories {
  metrics: IMetricsRepo;
  constructor(knex: Knex) {
    this.metrics = new MetricsRepo(knex);
  }
}
