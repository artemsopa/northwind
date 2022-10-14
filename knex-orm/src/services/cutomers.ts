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
    const data = await this.knex('public.customers').where({ id }).first();

    if (data === undefined) throw ApiError.badRequest('Unknown customer!');

    const customer = {
      id: data.id,
      companyName: data.company_name,
      contactName: data.contact_name,
      contactTitle: data.contact_title,
      address: data.address,
      city: data.city,
      postalCode: data.postal_code,
      region: data.region,
      country: data.country,
      phone: data.phone,
      fax: data.fax,
    };

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
