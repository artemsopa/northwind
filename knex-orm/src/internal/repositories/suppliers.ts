import { Knex } from 'knex';

export class SuppliersRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.suppliers').select();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.knex('public.suppliers').where({ id }).first();

    return data;
  }
}
