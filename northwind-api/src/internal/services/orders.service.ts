import { OrderItem, OrderInfo, OrderProduct } from './dtos/order';
import { IOrdersService } from './services';
import { IOrdersRepo, IProductsRepo } from '../repositories/repositories';
import ApiError from '../../pkg/error/api.error';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from './dtos/metric';

class OrdersService implements IOrdersService {
  constructor(private ordersRepo: IOrdersRepo, private productsRepo: IProductsRepo, private queue: ISQSQueue) {
    this.ordersRepo = ordersRepo;
    this.productsRepo = productsRepo;
    this.queue = queue;
  }

  async getAll(): Promise<OrderItem[]> {
    const prevMs = Date.now();
    const { orders, query, type } = await this.ordersRepo.getAll();
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    const items = orders.map((item) => new OrderItem(
      item.id,
      item.details.reduce((sum, curr) => sum + curr.quantity * curr.unitPrice, 0),
      item.details.length ? item.details.length : 0,
      item.details.reduce((sum, curr) => sum + curr.quantity, 0),
      item.shippedDate,
      item.shipName,
      item.shipCity,
      item.shipCountry,
    ));
    return items;
  }

  async getInfo(id: string): Promise<OrderInfo> {
    const prevMs = Date.now();
    const { order, query, type } = await this.ordersRepo.getInfo(id);
    const currMs = Date.now() - prevMs;

    const metric = new EnqueuedMetric(query, currMs, type);
    await this.queue.enqueueMessage<EnqueuedMetric>(metric);

    if (!order) throw ApiError.badRequest('Unknown order!');
    const item = new OrderInfo(
      order.id,
      order.shipName,
      order.details.length ? order.details.length : 0,
      order.details.reduce((sum, curr) => sum + curr.quantity, 0),
      order.details.reduce((sum, curr) => sum + curr.quantity * curr.unitPrice, 0),
      order.details.reduce((sum, curr) => sum + curr.discount, 0),
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
      await Promise.all(order.details.map(async (item) => {
        const product = await this.productsRepo.getById(item.productId);
        if (!product) throw ApiError.internal();
        return new OrderProduct(
          product.id,
          product.name,
          item.quantity,
          item.unitPrice,
          item.quantity * item.unitPrice,
          item.discount,
        );
      })),
    );
    return item;
  }
}

export default OrdersService;
