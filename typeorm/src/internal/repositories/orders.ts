import { DataSource } from 'typeorm';
import { Detail } from './entities/details';
import { Order } from './entities/orders';

export class OrdersRepo {
  constructor(private readonly ds: DataSource) {
    this.ds = ds;
  }

  async getAll() {
    const data = await this.ds.getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoinAndSelect(
        'orders.details',
        'order_details',
      ).getMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.ds.getRepository(Detail)
      .createQueryBuilder('order_details')
      .leftJoinAndSelect(
        'order_details.order',
        'orders',
      ).leftJoinAndSelect(
        'order_details.product',
        'products',
      )
      .where('order_details.order_id = :id', { id })
      .getMany();

    return data;
  }
}
