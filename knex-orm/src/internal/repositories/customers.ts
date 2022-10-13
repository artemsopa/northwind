import { Knex } from 'knex';

export class CustomersRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.customers').select();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.knex('public.customers').where({ id }).first();

    return data;
  }

  async search(company: string) {
    const data = await this.knex('public.customers')
      .whereRaw('LOWER(company_name) LIKE LOWER(?)', [`%${company}%`]).select();

    return data;
  }
}
