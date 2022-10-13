import { Kysely, sql } from 'kysely';
import { Database } from '@/internal/repositories/interfaces/interfaces';

export class CustomersRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('customers').selectAll().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.selectFrom('customers')
      .selectAll()
      .where('customers.id', '=', id)
      .limit(1)
      .execute();

    return data;
  }

  async search(company: string) {
    const data = await this.db.selectFrom('customers')
      .selectAll()
      .where(sql`lower(company_name)`, 'like', `%${company.toLowerCase()}%`)
      .execute();

    return data;
  }
}
