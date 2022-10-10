import { OrderItem, OrderInfo, OrderProduct } from './dtos/order';
import { IOrdersService } from './services';
import { IOrdersRepo, IProductsRepo } from '../repositories/repositories';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class OrdersService implements IOrdersService {
  constructor(private readonly ordersRepo: IOrdersRepo, private readonly queue: ISQSQueue) {
    this.ordersRepo = ordersRepo;
    this.queue = queue;
  }

  async getAll(): Promise<OrderItem[]> {
    const prevMs = Date.now();
    const { data, query, type } = await this.ordersRepo.getAll();
    const currMs = Date.now() - prevMs;

    // const metric = new EnqueuedMetric(query, currMs, type);
    // await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const map = new Map();
    for (const el of data) {
      const item: OrderItem = map.get(el.id);
      map.set(el.id, item ? new OrderItem(
        el.id,
        item.totalPrice + el.quantity * Number(el.unit_price),
        item.products + 1,
        item.quantity + el.quantity,
        el.shipped_date,
        el.ship_name,
        el.ship_city,
        el.ship_country,
      ) : new OrderItem(
        el.id,
        el.quantity * el.unit_price,
        1,
        el.quantity,
        el.shipped_date,
        el.ship_name,
        el.ship_city,
        el.ship_country,
      ));
    }
    const orders = Array.from(map, ([name, value]) => (value));
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
    const products: OrderProduct[] = Array.from(map, ([name, value]) => (value));

    const info = new OrderInfo(
      order.order_id,
      order.ship_name,
      products.length || 0,
      products.reduce((sum, curr) => sum + curr.quantity, 0),
      products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      products.reduce((sum, curr) => sum + curr.discount, 0),
      order.ship_via,
      Number(order.freight),
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
