import { eq, ilike } from 'drizzle-orm/expressions';
import { customers as table, Customer } from '@/internal/repositories/entities/customers';
import { Database } from '@/internal/repositories/entities/schema';

export class CustomersRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.customers.select().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.customers.select()
      .where(eq(table.id, id))
      .execute();

    return data;
  }

  async search(company: string) {
    const data = await this.db.customers.select()
      .where(ilike(table.companyName, `%${company}%`))
      .execute();

    return data;
  }
}
