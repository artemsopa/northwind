import { eq, ilike } from 'drizzle-orm/expressions';
import { Product, products as table } from './entities/products';
import { Database } from './entities/schema';
import { suppliers } from './entities/suppliers';

export class ProductsRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = this.db.products.select();

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
    const command = this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id));

    const prevMs = Date.now();
    const [data] = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'JOIN',
      ms,
    };
  }

  async search(name: string) {
    const command = this.db.products.select()
      .where(ilike(table.name, `%${name}%`));

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

  async createMany(products: Product[]): Promise<void> {
    await this.db.products.insert(products).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.products.delete().execute();
  }
}
