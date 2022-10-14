import { Knex } from 'knex';
import { ApiError } from '@/error';

export class ProductsService {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.products').select();

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
    const [data] = await this.knex('public.products')
      .select(['products.*', 'suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
      .whereRaw('products.id = (?)', [id])
      .leftJoin(
        'public.suppliers',
        'products.supplier_id',
        'suppliers.id',
      );

    if (data === undefined) throw ApiError.badRequest('Unknown product!');

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
    const data = await this.knex('public.products')
      .whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]).select();

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
