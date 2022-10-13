import { Knex } from 'knex';

export class MetricsRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    return await this.knex('public.metrics').select();
  }
}
