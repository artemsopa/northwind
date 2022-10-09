import { Knex } from 'knex';
import { MetricInput } from './entities/metric';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async create(metric: MetricInput): Promise<void> {
    await this.knex('northwind_schema.metrics').insert(metric);
  }
}

export default MetricsRepo;
