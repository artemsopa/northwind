import { Knex } from 'knex';
import { IOrdersRepo, ItemsWithMetric } from './repositories';
import { Order, OrderWithDetailAndProduct } from './types/order';
import { QueryTypes } from './types/metric';

class OrdersRepo implements IOrdersRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<ItemsWithMetric<any[]>> {
    const command = this.knex('northwind_schema.orders')
      .select([
        'orders.id',
        'orders.shipped_date',
        'orders.ship_name',
        'orders.ship_city',
        'orders.ship_country',
      ])
      .leftJoin(
        'northwind_schema.order_details',
        'order_details.order_id',
        'orders.id',
      )
      .count('product_id as products')
      .sum('quantity as quantity')
      .sum(this.knex.raw('?? * ??', ['quantity', 'unit_price']))
      .groupBy('orders.id')
      .orderBy('orders.id', 'asc');

    const data = await command;

    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<OrderWithDetailAndProduct[]>> {
    const command = this.knex('northwind_schema.order_details as od')
      .whereRaw('od.order_id = (?)', [id])
      .leftJoin(
        'northwind_schema.orders as o',
        'o.id',
        'od.order_id',
      )
      .leftJoin(
        'northwind_schema.products as p',
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

    const data = await command;

    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.knex('northwind_schema.orders').insert(orders);
  }

  async deleteAll(): Promise<void> {
    await this.knex('northwind_schema.orders').del();
  }
}

export default OrdersRepo;
