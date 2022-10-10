import { Kysely, sql } from 'kysely';
import { IProductsRepo, ItemsWithMetric } from './repositories';
import { Product, ProductWithSupplier } from './types/product';
import { QueryTypes } from './types/metric';
import Database from './types/types';

class ProductsRepo implements IProductsRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Product[]>> {
    const command = this.db.selectFrom('products')
      .selectAll();

    const data = await command.execute() as Product[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<ProductWithSupplier | null>> {
    const command = this.db.selectFrom('products')
      .selectAll()
      .where('products.id', '=', id)
      .limit(1)
      .leftJoinLateral(
        (eb) => eb.selectFrom('suppliers')
          .select(['suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
          .whereRef('suppliers.id', '=', 'products.supplier_id')
          .as('s1'),
        (join) => join.onTrue(),
      );

    const [data] = await command.execute() as ProductWithSupplier[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async search(name: string): Promise<ItemsWithMetric<Product[]>> {
    const command = this.db.selectFrom('products')
      .selectAll()
      .where(sql`lower(name)`, 'like', `%${name.toLowerCase()}%`);

    const data = await command.execute() as Product[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(products: Product[]): Promise<void> {
    await this.db.insertInto('products').values(products).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('products').execute();
  }
}

export default ProductsRepo;
