import { Knex } from 'knex';
import { ApiError } from '@/error';

export class CustomersService {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.customers').select();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.company_name,
      contactName: item.contact_name,
      contactTitle: item.contact_title,
      city: item.city,
      country: item.country,
    }));

    return customers;
  }

  async getInfo(id: string) {
    const customer = await this.knex('public.customers').where({ id }).first();

    if (customer === undefined) throw ApiError.badRequest('Unknown customer!');

    return customer;
  }

  async search(company: string) {
    const data = await this.knex('public.customers')
      .whereRaw('LOWER(company_name) LIKE LOWER(?)', [`%${company}%`]).select();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.company_name,
      contactName: item.contact_name,
      contactTitle: item.contact_title,
      city: item.city,
      country: item.country,
    }));
    return customers;
  }
}
