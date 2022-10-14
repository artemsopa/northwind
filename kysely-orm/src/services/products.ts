import { Kysely, sql } from 'kysely';
import { Database, ProductWithSupplier } from '@/dtos';
import { ApiError } from '@/error';

export class ProductsService {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('products').selectAll().execute();

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qt_per_unit,
      unitPrice: item.unit_price,
      unitsInStock: item.units_in_stock,
      unitsOnOrder: item.units_on_order,
    }));
    return products;
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
      .execute() as ProductWithSupplier[];

    if (!data) throw ApiError.badRequest('Unknown product!');

    const supplier = {
      id: data.s_id,
      companyName: data.s_company_name,
    };

    const item = {
      id: data.id,
      name: data.name,
      qtPerUnit: data.qt_per_unit,
      unitPrice: data.unit_price,
      unitsInStock: data.units_in_stock,
      unitsOnOrder: data.units_on_order,
      reorderLevel: data.reorder_level,
      discontinued: data.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const data = await this.db.selectFrom('products')
      .selectAll()
      .where(sql`lower(name)`, 'like', `%${name.toLowerCase()}%`)
      .execute();

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qt_per_unit,
      unitPrice: item.unit_price,
      unitsInStock: item.units_in_stock,
      unitsOnOrder: item.units_on_order,
    }));
    return products;
  }
}
