import { eq, ilike } from 'drizzle-orm/expressions';
import { IProductsRepo, ItemsWithMetric, QueryTypes } from './repositories';
import { Product, products as table } from './entities/products';
import { DataBase } from './entities/schema';
import { Supplier, suppliers } from './entities/suppliers';

class ProductsRepo implements IProductsRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Product[]>> {
    const command = this.db.products.select();

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<{ suppliers: Supplier | null, products: Product } | null>> {
    const command = this.db.products.select()
      .leftJoin(suppliers, eq(table.supplierId, suppliers.id))
      .where(eq(table.id, id));

    const [data] = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async search(name: string): Promise<ItemsWithMetric<Product[]>> {
    const command = this.db.products.select()
      .where(ilike(table.name, `%${name}%`));

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(products: Product[]): Promise<void> {
    await this.db.products.insert(products).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.products.delete().execute();
  }
}

export default ProductsRepo;
