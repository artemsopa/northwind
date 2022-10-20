import { eq, ilike } from 'drizzle-orm/expressions';
import { ApiError } from '@/error';
import { Database, customers as table } from '@/data/schema';

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
    const [customer] = await this.db.customers.select()
      .where(eq(table.id, id))
      .limit(1)
      .execute();

    if (!customer) throw ApiError.badRequest('Unknown customer!');

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
