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

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const orders = data.map((item) => new OrderItem(
      item.id,
      item.details.reduce((sum, curr) => sum + curr.quantity * curr.unitPrice, 0),
      item.details.length || 0,
      item.details.reduce((sum, curr) => sum + curr.quantity, 0),
      item.shippedDate,
      item.shipName,
      item.shipCity,
      item.shipCountry,
    ));
    return orders;
  }

  async getInfo(id: string): Promise<OrderInfo> {
    const prevMs = Date.now();
    const { data, query, type } = await this.ordersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const [{ order }] = data;
    if (!order) throw ApiError.badRequest('Unknown order!');

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const map = new Map();
    for (const el of data) {
      if (el && el.product) {
        map.set(
          { order: el.order.id, product: el.product.id },
          new OrderProduct(
            el.product.id,
            el.product.name,
            el.quantity,
            el.unitPrice,
            el.quantity * el.unitPrice,
            el.discount,
          ),
        );
      }
    }
    const products: OrderProduct[] = Array.from(map, ([name, value]) => (value));
    const info = new OrderInfo(
      order.id,
      order.shipName,
      products.length || 0,
      products.reduce((sum, curr) => sum + curr.quantity, 0),
      products.reduce((sum, curr) => sum + curr.totalPrice, 0),
      products.reduce((sum, curr) => sum + curr.discount, 0),
      order.shipVia,
      order.freight,
      order.orderDate,
      order.requiredDate,
      order.shippedDate,
      order.shipCity,
      order.shipRegion,
      order.shipPostalCode,
      order.shipCountry,
      order.customerId,
      products,
    );
    return info;
  }
}

export default OrdersService;
