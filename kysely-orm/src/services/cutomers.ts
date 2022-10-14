import { Kysely, sql } from 'kysely';
import { Database } from '@/dtos';
import { ApiError } from '@/error';

export class CustomersService {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('customers').selectAll().execute();

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
    const [data] = await this.db.selectFrom('customers')
      .selectAll()
      .where('customers.id', '=', id)
      .limit(1)
      .execute();

    if (!data) throw ApiError.badRequest('Unknown customer!');

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
    const data = await this.db.selectFrom('customers')
      .selectAll()
      .where(sql`lower(company_name)`, 'like', `%${company.toLowerCase()}%`)
      .execute();

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
