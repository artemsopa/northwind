import { eq } from 'drizzle-orm/expressions';
import { Order, orders as table } from './entities/orders';
import { details } from './entities/details';
import { Database } from './entities/schema';
import { products } from './entities/products';

export class OrdersRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = this.db.orders.select()
      .leftJoin(details, eq(table.id, details.orderId));

    const prevMs = Date.now();
    const data = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'JOIN',
      ms,
    };
  }

  async getInfo(id: string) {
    const command = this.db.details.select()
      .leftJoin(table, eq(details.orderId, table.id))
      .leftJoin(products, eq(details.productId, products.id))
      .where(eq(details.orderId, id));

    const prevMs = Date.now();
    const data = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'JOIN',
      ms,
    };
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.db.orders.insert(orders).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.orders.delete().execute();
  }
}
