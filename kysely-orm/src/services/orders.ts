import { Kysely } from 'kysely';
import { Database, OrderWithDetail } from '@/dtos';
import { ApiError } from '@/error';

export class OrdersService {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('orders')
      .selectAll()
      .leftJoinLateral(
        (eb) => eb.selectFrom('order_details')
          .select(['quantity', 'unit_price'])
          .whereRef('order_details.order_id', '=', 'orders.id')
          .as('e'),
        (join) => join.onTrue(),
      ).execute() as OrderWithDetail[];

    const map = new Map();
    for (const el of data) {
      const item = map.get(el.id);
      map.set(el.id, item ? {
        totalPrice: item.totalPrice + el.quantity * el.unit_price,
        products: item.products++,
        quantity: item.quantity + el.quantity,
        shipped: el.shipped_date,
        shipName: el.ship_name,
        city: el.ship_city,
        shipCountry: el.ship_country,
      } : {
        totalPrice: el.quantity * el.unit_price,
        products: 1,
        quantity: el.quantity,
        shipped: el.shipped_date,
        shipName: el.ship_name,
        city: el.ship_city,
        shipCountry: el.ship_country,
      });
    }
    const orders = Array.from(map, ([key, value]) => ({ id: key, ...value }));
    return orders;
  }

  async getInfo(id: string) {
    const data = await this.db.selectFrom('order_details')
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
          .whereRef('order_details.order_id', '=', 'orders.id')
          .as('o'),
        (join) => join.onTrue(),
      )
      .leftJoinLateral(
        (eb) => eb.selectFrom('products')
          .select(['id as p_id', 'name as p_name'])
          .whereRef('order_details.product_id', '=', 'products.id')
          .as('p'),
        (join) => join.onTrue(),
      )
      .execute() as any[];

    const [order] = data;
    if (!order) throw ApiError.badRequest('Unknown order!');

    const map = new Map();
    for (const el of data) {
      map.set(
        { order: el.order_id, product: el.p_id },
        {
          id: el.p_id,
          name: el.p_name,
          quantity: el.quantity,
          orderPrice: Number(el.unit_price),
          totalPrice: el.quantity * Number(el.unit_price),
          discount: Number(el.discount),
        },
      );
    }
    const products = Array.from(map, ([name, value]) => (value));

    const info = ({
      id: order.order_id,
      shipName: order.ship_name,
      totalProducts: products.length || 0,
      totalQuantity: products.reduce((sum, curr) => sum + curr.quantity, 0),
      totalPrice: products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      totalDiscount: products.reduce((sum, curr) => sum + curr.discount, 0),
      shipVia: order.ship_via,
      freight: order.freight,
      orderDate: order.order_date,
      requiredDate: order.required_date,
      shippedDate: order.shipped_date,
      shipCity: order.ship_city,
      shipRegion: order.ship_region,
      shipPostalCode: order.ship_postal_code,
      shipCountry: order.ship_country,
      customerId: order.customer_id,
      products,
    });
    return info;
  }
}
