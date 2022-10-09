import { Knex } from 'knex';
import { IProductsRepo, ItemsWithMetric } from './repositories';
import { Product, ProductWithSupplier } from './types/product';
import { QueryTypes } from './types/metric';

class ProductsRepo implements IProductsRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<ItemsWithMetric<Product[]>> {
    const command = this.knex('northwind_schema.products').select();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<ProductWithSupplier | undefined>> {
    const command = this.knex('northwind_schema.products')
      .select(['products.*', 'suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
      .whereRaw('products.id = (?)', [id])
      .leftJoin(
        'northwind_schema.suppliers',
        'products.supplier_id',
        'suppliers.id',
      );

    const [data] = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async search(name: string): Promise<ItemsWithMetric<Product[]>> {
    const command = this.knex('northwind_schema.products')
      .whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]).select();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(products: Product[]): Promise<void> {
    await this.knex('northwind_schema.products').insert(products);
  }

  async deleteAll(): Promise<void> {
    await this.knex('northwind_schema.products').del();
  }
}

export default ProductsRepo;
