import { Knex } from 'knex';
import { ICustomersRepo, ItemsWithMetric } from './repositories';
import { Customer } from './types/customer';
import { QueryTypes } from './types/metric';

class CustomersRepo implements ICustomersRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.knex('northwind_schema.customers').select();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Customer | undefined>> {
    const command = this.knex('northwind_schema.customers').where({ id }).first();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async search(company: string): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.knex('northwind_schema.customers')
      .whereRaw('LOWER(company_name) LIKE LOWER(?)', [`%${company}%`]).select();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(customers: Customer[]): Promise<void> {
    await this.knex('northwind_schema.customers').insert(customers);
  }

  async deleteAll(): Promise<void> {
    await this.knex('northwind_schema.customers').del();
  }
}

export default CustomersRepo;
