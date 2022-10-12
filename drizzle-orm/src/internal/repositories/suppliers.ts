import { eq } from 'drizzle-orm/expressions';
import { Supplier, suppliers as table } from '@/internal/repositories/entities/suppliers';
import { Database } from '@/internal/repositories/entities/schema';

export class SuppliersRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.suppliers.select().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.suppliers.select()
      .where(eq(table.id, id))
      .execute();

    return data;
  }
}
