import { Knex } from 'knex';
import { ISuppliersRepo, ItemsWithMetric } from './repositories';
import { Supplier } from './types/supplier';
import { QueryTypes } from './types/metric';

class SuppliersRepo implements ISuppliersRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<ItemsWithMetric<Supplier[]>> {
    const command = this.knex<Supplier>('northwind_schema.suppliers').select();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Supplier | undefined>> {
    const command = this.knex<Supplier>('northwind_schema.suppliers').where({ id }).first();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(suppliers: Supplier[]): Promise<void> {
    await this.knex<Supplier>('northwind_schema.suppliers').insert(suppliers);
  }

  async deleteAll(): Promise<void> {
    await this.knex<Supplier>('northwind_schema.suppliers').del();
  }
}

export default SuppliersRepo;
