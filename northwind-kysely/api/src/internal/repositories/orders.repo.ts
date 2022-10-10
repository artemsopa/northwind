import { Kysely, sql } from 'kysely';
import { IOrdersRepo, ItemsWithMetric } from './repositories';
import { Order, OrderWithDetail, OrderWithDetailAndProduct } from './types/order';
import { QueryTypes } from './types/metric';
import Database from './types/types';

class OrdersRepo implements IOrdersRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<OrderWithDetail[]>> {
    const command = this.db.selectFrom('orders')
      .selectAll()
      .leftJoinLateral(
        (eb) => eb.selectFrom('details')
          .select(['quantity', 'unit_price'])
          // .select([
          //   this.db.fn.count<number>('product_id').as('products'),
          //   this.db.fn.sum<number>('quantity').as('quantity'),
          // ])
          // .groupBy(['order_id'])
          // .orderBy('order_id', 'asc')
          .whereRef('details.order_id', '=', 'orders.id')
          .as('e'),
        (join) => join.onTrue(),
      );

    const data = await command.execute() as OrderWithDetail[];
    console.log(data);
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;
    console.log(query);

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<any[]>> {
    const command = this.db.selectFrom('details')
      .selectAll()
      .where('order_id', '=', id)
      .leftJoinLateral(
        (eb) => eb.selectFrom('orders')
          .select([
            'ship_name',
            'ship_via',
            'freight',
            'order_date',
            'required_date',
            'shipped_date',
            'ship_city',
            'ship_region',
            'ship_postal_code',
            'ship_country',
            'customer_id',
          ])
          .whereRef('details.order_id', '=', 'orders.id')
          .as('o'),
        (join) => join.onTrue(),
      )
      .leftJoinLateral(
        (eb) => eb.selectFrom('products')
          .select(['id as p_id', 'name as p_name'])
          .whereRef('details.product_id', '=', 'products.id')
          .as('p'),
        (join) => join.onTrue(),
      );

    const data = await command.execute();
    console.log(data);
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;
    console.log(query);

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.db.insertInto('orders').values(orders).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('orders').execute();
  }
}

export default OrdersRepo;
