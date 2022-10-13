import { eq, ilike } from 'drizzle-orm/expressions';
import { products as table } from '@/internal/repositories/entities/products';
import { Database } from '@/internal/repositories/entities/schema';
import { suppliers } from '@/internal/repositories/entities/suppliers';

export class ProductsRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = this.db.products.select().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id))
      .execute();

    return data;
  }

  async search(name: string) {
    const data = this.db.products.select()
      .where(ilike(table.name, `%${name}%`))
      .execute();

    return data;
  }
}
