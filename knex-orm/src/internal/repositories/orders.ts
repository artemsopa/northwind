import { Knex } from 'knex';

export class OrdersRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.orders')
      .select([
        'orders.id',
        'orders.shipped_date',
        'orders.ship_name',
        'orders.ship_city',
        'orders.ship_country',
      ])
      .leftJoin(
        'public.order_details',
        'order_details.order_id',
        'orders.id',
      )
      .count('product_id as products')
      .sum('quantity as quantity')
      .sum(this.knex.raw('?? * ??', ['quantity', 'unit_price']))
      .groupBy('orders.id')
      .orderBy('orders.id', 'asc');

    return data;
  }

  async getInfo(id: string) {
    const data = await this.knex('public.order_details as od')
      .whereRaw('od.order_id = (?)', [id])
      .leftJoin(
        'public.orders as o',
        'o.id',
        'od.order_id',
      )
      .leftJoin(
        'public.products as p',
        'p.id',
        'od.product_id',
      )
      .select([
        'o.*',

        'od.unit_price as od_uprice',
        'od.quantity as od_quantity',
        'od.discount as od_discount',

        'p.id as p_id',
        'p.name as p_name',
      ]);

    return data;
  }
}
