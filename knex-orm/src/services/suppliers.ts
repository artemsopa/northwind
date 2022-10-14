import { Knex } from 'knex';
import { ApiError } from '@/error';

export class SuppliersService {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.suppliers').select();

    const suppliers = data.map((item) => ({
      id: item.id,
      companyName: item.company_name,
      contactName: item.contact_name,
      contactTitle: item.contact_title,
      city: item.city,
      country: item.country,
    }));
    return suppliers;
  }

  async getInfo(id: string) {
    const supplier = await this.knex('public.suppliers').where({ id }).first();

    if (supplier === undefined) throw ApiError.badRequest('Unknown supplier!');

    return supplier;
  }
}
