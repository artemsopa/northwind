import { OrderItem, OrderInfo, OrderProduct } from './dtos/order';
import { IOrdersService } from './services';
import { IOrdersRepo, IProductsRepo } from '../repositories/repositories';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class OrdersService implements IOrdersService {
  constructor(private readonly ordersRepo: IOrdersRepo) {
    this.ordersRepo = ordersRepo;
  }

  async getAll(): Promise<OrderItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.ordersRepo.getAll();
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

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

  async getInfo(id: string): Promise<OrderInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.ordersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const [order] = data;
    if (!order) throw ApiError.badRequest('Unknown order!');

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const map = new Map();
    for (const el of data) {
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
    const products: OrderProduct[] = Array.from(map, ([name, value]) => (value));

    const info = new OrderInfo(
      order.id,
      order.ship_name,
      products.length || 0,
      products.reduce((sum, curr) => sum + curr.quantity, 0),
      products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      products.reduce((sum, curr) => sum + curr.discount, 0),
      order.ship_via,
      order.freight,
      order.order_date,
      order.required_date,
      order.shipped_date,
      order.ship_city,
      order.ship_region,
      order.ship_postal_code,
      order.ship_country,
      order.customer_id,
      products,
    );
    return info;
  }
}

export default OrdersService;
