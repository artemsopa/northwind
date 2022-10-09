import { eq } from 'drizzle-orm/expressions';
import { IOrdersRepo, ItemsWithMetric, QueryTypes } from './repositories';
import { Order, orders as table } from './entities/orders';
import { Detail, details } from './entities/details';
import { DataBase } from './entities/schema';
import { Product, products } from './entities/products';

class OrdersRepo implements IOrdersRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<{ orders: Order, details: Detail | null }[]>> {
    const command = this.db.orders.select()
      .leftJoin(details, eq(table.id, details.orderId));

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<{ orders: Order | null, products: Product | null, details: Detail }[] | null>> {
    const command = this.db.details.select()
      .leftJoin(table, eq(details.orderId, table.id))
      .leftJoin(products, eq(details.productId, products.id))
      .where(eq(details.orderId, id));

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;
    console.log(data);

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.db.orders.insert(orders).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.orders.delete().execute();
  }
}

export default OrdersRepo;
