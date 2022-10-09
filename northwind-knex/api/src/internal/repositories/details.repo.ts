import { Knex } from 'knex';
import { Detail } from './types/detail';
import { IDetailsRepo } from './repositories';

class DetailsRepo implements IDetailsRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async createMany(details: Detail[]): Promise<void> {
    await this.knex<Detail>('northwind_schema.order_details').insert(details);
  }

  async deleteAll(): Promise<void> {
    await this.knex<Detail>('northwind_schema.order_details').del();
  }
}

export default DetailsRepo;
