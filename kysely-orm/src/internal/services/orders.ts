import { ErrorApi } from '@/pkg/error';
import { OrdersRepo } from '@/internal/repositories/orders';

export class OrdersService {
  constructor(private readonly repo: OrdersRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

    const map = new Map();
    for (const el of data) {
      const item = map.get(el.id);
      map.set(el.id, item ? {
        totalPrice: item.totalPrice + el.quantity * el.unit_price,
        products: item.products++,
        quantity: item.quantity + el.quantity,
        shippedDate: el.shipped_date,
        shipName: el.ship_name,
        shipCity: el.ship_city,
        shipCountry: el.ship_country,
      } : {
        totalPrice: el.quantity * el.unit_price,
        products: 1,
        quantity: el.quantity,
        shippedDate: el.shipped_date,
        shipName: el.ship_name,
        shipCity: el.ship_city,
        shipCountry: el.ship_country,
      });
    }
    const orders = Array.from(map, ([key, value]) => ({ id: key, ...value }));
    return orders;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    const [order] = data;
    if (!order) throw ErrorApi.badRequest('Unknown order!');

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
