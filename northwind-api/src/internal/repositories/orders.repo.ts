import { DataSource, Repository } from 'typeorm';
import { IMetricsRepo, IOrdersRepo } from './repositories';
import Order from './entities/order';
import { QueryTypes } from './entities/metric';

class OrdersRepo implements IOrdersRepo {
  private repo: Repository<Order>;
  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Order);
  }

  async getAll(): Promise<{ orders: Order[], query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.details',
        'order_details',
      );

    const orders = await query.getMany();

    return {
      orders,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT_LEFT_JOIN,
    };
  }

  async getInfo(id: string): Promise<{ order: Order | null, query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.details',
        'details',
        'details.order_id = :orderId',
        { orderId: id },
      )
      .leftJoinAndSelect(
        'orders.customer',
        'customers',
      )
      .where('orders.id = :id', { id });

    const order = await query.getOne();

    return {
      order,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.repo.save(orders);
  }

  async deleteAll(): Promise<void> {
    await this.repo.createQueryBuilder('orders').delete().execute();
  }
}

export default OrdersRepo;
