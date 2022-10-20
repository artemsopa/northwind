import { eq } from 'drizzle-orm/expressions';
import { ApiError } from '@/error';
import { suppliers as table, Database } from '@/data/schema';

export class SuppliersService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.suppliers.select().execute();

    const suppliers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return suppliers;
  }

  async getInfo(id: string) {
    const [supplier] = await this.db.suppliers.select()
      .where(eq(table.id, id))
      .limit(1)
      .execute();

    if (!supplier) throw ApiError.badRequest('Unknown supplier!');

    return supplier;
  }
}
