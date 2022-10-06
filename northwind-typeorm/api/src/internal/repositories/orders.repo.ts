import { DataSource } from 'typeorm';
import { IOrdersRepo, ItemsWithMetric } from './repositories';
import Order from './entities/order';
import { QueryTypes } from './entities/metric';
import Detail from './entities/detail';

class OrdersRepo implements IOrdersRepo {
  constructor(private readonly ds: DataSource) {
    this.ds = ds;
  }

  async getAll(): Promise<ItemsWithMetric<Order[]>> {
    const command = this.ds.getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.details',
        'order_details',
      );

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Detail[]>> {
    const command = this.ds.getRepository(Detail)
      .createQueryBuilder('order_details')
      .leftJoinAndSelect(
        'order_details.order',
        'orders',
      ).leftJoinAndSelect(
        'order_details.product',
        'products',
      )
      .where('order_details.order_id = :id', { id });

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async createMany(orders: Order[]): Promise<void> {
    await this.ds.getRepository(Order).save(orders);
  }

  async deleteAll(): Promise<void> {
    await this.ds.getRepository(Order).createQueryBuilder('orders').delete().execute();
  }
}

export default OrdersRepo;
