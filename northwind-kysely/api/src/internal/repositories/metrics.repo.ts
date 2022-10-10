import { Knex } from 'knex';
import { Metric } from './types/metric';
import { IMetricsRepo } from './repositories';

class MetricsRepo implements IMetricsRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<Metric[]> {
    return await this.knex('northwind_schema.metrics').select();
  }
}

export default MetricsRepo;
