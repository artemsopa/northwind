import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { Order, orders as table } from '@/internal/repositories/entities/orders';
import { details } from '@/internal/repositories/entities/details';
import { Database } from '@/internal/repositories/entities/schema';
import { products } from '@/internal/repositories/entities/products';

export class OrdersRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = sql`SELECT id, shipped_date, ship_name, ship_city, ship_country, 
     COUNT(product_id) AS products, SUM(quantity) AS quantity, SUM(quantity * unit_price) AS total_price
     FROM orders AS o LEFT JOIN order_details AS od ON od.order_id = o.id GROUP BY o.id ORDER BY o.id ASC`;

    const { rows } = await this.db.execute(command);

    return rows;
  }

  async getInfo(id: string) {
    const data = await this.db.details.select()
      .leftJoin(table, eq(details.orderId, table.id))
      .leftJoin(products, eq(details.productId, products.id))
      .where(eq(details.orderId, id))
      .execute();

    return data;
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.db.orders.insert(orders).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.orders.delete().execute();
  }
}
