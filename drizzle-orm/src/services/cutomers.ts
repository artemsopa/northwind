import { eq, ilike } from 'drizzle-orm/expressions';
import { ApiError } from '@/app';
import { Database } from '@/entities/schema';
import { customers as table } from '@/entities/customers';

export class CustomersService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.customers.select().execute();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));

    return customers;
  }

  async getInfo(id: string) {
    const [data] = await this.db.customers.select()
      .where(eq(table.id, id))
      .execute();

    if (!data) throw ApiError.badRequest('Unknown customer!');

    const customer = {
      id: data.id,
      companyName: data.companyName,
      contactName: data.contactName,
      contactTitle: data.contactTitle,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      region: data.region,
      country: data.country,
      phone: data.phone,
      fax: data.fax,
    };

    return customer;
  }

  async search(company: string) {
    const data = await this.db.customers.select()
      .where(ilike(table.companyName, `%${company}%`))
      .execute();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return customers;
  }
}
