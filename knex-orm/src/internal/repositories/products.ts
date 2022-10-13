import { Knex } from 'knex';

export class ProductsRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.products').select();

    return data;
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

    return data;
  }

  async search(name: string) {
    const data = await this.knex('public.products')
      .whereRaw('LOWER(name) LIKE LOWER(?)', [`%${name}%`]).select();

    return data;
  }
}
