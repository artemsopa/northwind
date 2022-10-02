import { DataSource } from 'typeorm';
import Metric, { QueryTypes } from './entities/metric';
import MetricsRepo from './metrics.repo';

export interface IMetricsRepo {
  getAll(): Promise<Metric[]>;
  create(metric: Metric): Promise<void>;
}

export default class Repositories {
  metrics: IMetricsRepo;
  constructor(ds: DataSource) {
    this.metrics = new MetricsRepo(ds);
  }
}
