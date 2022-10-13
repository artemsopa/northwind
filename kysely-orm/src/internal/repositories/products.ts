import { Kysely, sql } from 'kysely';
import { Database, ProductWithSupplier } from '@/internal/repositories/interfaces/interfaces';

export class ProductsRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('products').selectAll().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.selectFrom('products')
      .selectAll()
      .where('products.id', '=', id)
      .limit(1)
      .leftJoinLateral(
        (eb) => eb.selectFrom('suppliers')
          .select(['suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
          .whereRef('suppliers.id', '=', 'products.supplier_id')
          .as('s1'),
        (join) => join.onTrue(),
      )
      .execute();

    return data as ProductWithSupplier;
  }

  async search(name: string) {
    const data = await this.db.selectFrom('products')
      .selectAll()
      .where(sql`lower(name)`, 'like', `%${name.toLowerCase()}%`)
      .execute();

    return data;
  }
}
