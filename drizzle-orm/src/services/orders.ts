import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { ApiError } from '@/error';
import { orders as table } from '@/entities/orders';
import { details } from '@/entities/details';
import { Database } from '@/entities/schema';
import { products as productsTable } from '@/entities/products';

export class OrdersService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = sql`SELECT id, shipped_date, ship_name, ship_city, ship_country, 
     COUNT(product_id) AS products, SUM(quantity) AS quantity, SUM(quantity * unit_price) AS total_price
     FROM orders AS o LEFT JOIN order_details AS od ON od.order_id = o.id GROUP BY o.id ORDER BY o.id ASC`;

    const { rows } = await this.db.execute(command);

    const orders = rows.map((item) => ({
      id: item.id,
      totalPrice: Number(item.total_price.toFixed(2)),
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
    const data = await this.db.details.select()
      .leftJoin(table, eq(details.orderId, table.id))
      .leftJoin(productsTable, eq(details.productId, productsTable.id))
      .where(eq(details.orderId, id))
      .execute();

    if (!data.length !) throw ApiError.badRequest('Cannot find order`s details with products!');

    const [{ orders }] = data;
    if (!orders) throw ApiError.badRequest('Unknown order!');

    const map = new Map();
    for (const el of data) {
      if (el.details && el.products) {
        map.set(
          { order: orders.id, product: el.products.id },
          {
            id: el.products.id,
            name: el.products.name,
            quantity: el.details.quantity,
            unitPrice: el.details.unitPrice,
            totalPrice: el.details.quantity * el.details.unitPrice,
            discount: el.details.discount,
          },
        );
      }
    }

    const products = Array.from(map, ([name, value]) => (value));

    const info = {
      id: orders.id,
      shipName: orders.shipName,
      totalProducts: products.length || 0,
      totalQuantity: products.reduce((sum, curr) => sum + curr.quantity, 0),
      totalPrice: products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      totalDiscount: products.reduce((sum, curr) => sum + curr.discount, 0),
      shipVia: orders.shipVia,
      freight: orders.freight,
      orderDate: orders.orderDate,
      requiredDate: orders.requiredDate,
      shippedDate: orders.shippedDate,
      shipCity: orders.shipCity,
      shipRegion: orders.shipRegion,
      shipPostalCode: orders.shipPostalCode,
      shipCountry: orders.shipCountry,
      customerId: orders.customerId,
      products,
    };
    return info;
  }
}
