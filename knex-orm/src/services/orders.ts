import { Knex } from 'knex';
import { ApiError } from '@/error';

export class OrdersService {
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

    const orders = data.map((item) => ({
      id: item.id,
      totalPrice: Number(item.sum),
      products: Number(item.products),
      quantity: Number(item.quantity),
      shipped: item.shipped_date,
      shipName: item.ship_name,
      city: item.ship_city,
      country: item.ship_country,
    }));
    return orders;
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

    const [order] = data;
    if (order === undefined) throw ApiError.badRequest('Unknown order!');

    const map = new Map();
    for (const el of data) {
      if (el.id && el.p_id) {
        map.set(
          { order: el.id, product: el.p_id },
          {
            id: el.p_id,
            name: el.p_name,
            quantity: el.od_quantity,
            orderPrice: el.od_uprice,
            totalPrice: el.od_quantity * el.od_uprice,
            discount: el.od_discount,
          },
        );
      }
    }

    const products = Array.from(map, ([name, value]) => (value));

    const info = {
      id: order.id,
      ship_name: order.ship_name,
      totalProducts: products.length || 0,
      totalQuantity: products.reduce((sum, curr) => sum + curr.quantity, 0),
      totalPrice: products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      totalDiscount: products.reduce((sum, curr) => sum + curr.discount, 0),
      ship_via: order.ship_via,
      freight: order.freight,
      order_date: order.order_date,
      required_date: order.required_date,
      shipped_date: order.shipped_date,
      ship_city: order.ship_city,
      ship_region: order.ship_region,
      ship_postal_code: order.ship_postal_code,
      ship_country: order.ship_country,
      customer_id: order.customer_id,
      products,
    };
    return info;
  }
}
