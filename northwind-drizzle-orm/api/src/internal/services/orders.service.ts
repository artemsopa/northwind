import { OrderItem, OrderInfo, OrderProduct } from './dtos/order';
import { IOrdersService } from './services';
import { IOrdersRepo } from '../repositories/repositories';
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

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const map = new Map();
    for (const el of data) {
      if (el.details) {
        const item: OrderItem = map.get(el.orders.id);
        map.set(el.orders.id, item ? new OrderItem(
          el.orders.id,
          item.totalPrice + el.details.quantity * el.details.unitPrice,
          item.products + 1,
          item.quantity + el.details.quantity,
          el.orders.shippedDate,
          el.orders.shipName,
          el.orders.shipCity,
          el.orders.shipCountry,
        ) : new OrderItem(
          el.orders.id,
          el.details.quantity * el.details.unitPrice,
          1,
          el.details.quantity,
          el.orders.shippedDate,
          el.orders.shipName,
          el.orders.shipCity,
          el.orders.shipCountry,
        ));
      }
    }
    const orders = Array.from(map, ([name, value]) => (value));
    return orders;
  }

  async getInfo(id: string): Promise<OrderInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.ordersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!data || !data.length) throw ApiError.badRequest('Cannot find order details with products!');

    const [{ orders }] = data;
    if (!orders) throw ApiError.badRequest('Unknown order!');

    const map = new Map();
    for (const el of data) {
      if (el.details && el.products) {
        map.set(
          { order: orders.id, product: el.products.id },
          new OrderProduct(
            el.products.id,
            el.products.name,
            el.details.quantity,
            el.details.unitPrice,
            el.details.quantity * el.details.unitPrice,
            el.details.discount,
          ),
        );
      }
    }

    const products: OrderProduct[] = Array.from(map, ([name, value]) => (value));
    const info = new OrderInfo(
      orders.id,
      orders.shipName,
      products.length || 0,
      products.reduce((sum, curr) => sum + curr.quantity, 0),
      products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      products.reduce((sum, curr) => sum + curr.discount, 0),
      orders.shipVia,
      orders.freight,
      orders.orderDate,
      orders.requiredDate,
      orders.shippedDate,
      orders.shipCity,
      orders.shipRegion,
      orders.shipPostalCode,
      orders.shipCountry,
      orders.customerId,
      products,
    );
    return info;
  }
}

export default OrdersService;
