import { ErrorApi } from '@/pkg/error';
import { OrdersRepo } from '@/internal/repositories/orders';

export class OrdersService {
  constructor(private readonly repo: OrdersRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

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
    const data = await this.repo.getInfo(id);

    const [order] = data;
    if (order === undefined) throw ErrorApi.badRequest('Unknown order!');

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
