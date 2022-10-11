import { ErrorApi } from '@/pkg/error';
import { Queue } from '@/pkg/queue';
import { OrdersRepo } from '@/internal/repositories/orders';

export class OrdersService {
  constructor(private readonly repo: OrdersRepo, private readonly queue: Queue) {
    this.repo = repo;
    this.queue = queue;
  }

  async getAll() {
    const { data, query, type, ms } = await this.repo.getAll();

    // await this.queue.enqueueMessage({ query, type, ms });

    const orders = data.map((item) => ({
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
    const { data, query, type, ms } = await this.repo.getInfo(id);

    if (!data.length !) throw ErrorApi.badRequest('Cannot find order`s details with products!');

    const [{ orders }] = data;
    if (!orders) throw ErrorApi.badRequest('Unknown order!');

    // await this.queue.enqueueMessage({ query, type, ms });

    const map = new Map();
    for (const el of data) {
      if (el.details && el.products) {
        map.set(
          { order: orders.id, product: el.products.id },
          ({
            id: el.products.id,
            name: el.products.name,
            quantity: el.details.quantity,
            unitPrice: el.details.unitPrice,
            totalPrice: el.details.quantity * el.details.unitPrice,
            discount: el.details.discount,
          }),
        );
      }
    }
    const products = Array.from(map, ([name, value]) => (value));

    const info = ({
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
    });
    return info;
  }
}
