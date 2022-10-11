import { eq, ilike } from 'drizzle-orm/expressions';
import { customers as table, Customer } from './entities/customers';
import { Database } from './entities/schema';

export class CustomersRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = this.db.customers.select();

    const prevMs = Date.now();
    const data = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'SELECT',
      ms,
    };
  }

  async getInfo(id: string) {
    const command = this.db.customers.select()
      .where(eq(table.id, id));

    const prevMs = Date.now();
    const [data] = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'WHERE',
      ms,
    };
  }

  async search(company: string) {
    const command = this.db.customers.select()
      .where(ilike(table.companyName, `%${company}%`));

    const prevMs = Date.now();
    const data = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'WHERE',
      ms,
    };
  }

  async createMany(customers: Customer[]): Promise<void> {
    await this.db.customers.insert(customers).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.customers.delete().execute();
  }
}
