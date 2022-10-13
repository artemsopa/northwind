import { Kysely } from 'kysely';
import { Database, OrderWithDetail, OrderWithDetailAndProduct } from '@/internal/repositories/interfaces/interfaces';

export class OrdersRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('orders')
      .selectAll()
      .leftJoinLateral(
        (eb) => eb.selectFrom('order_details')
          .select(['quantity', 'unit_price'])
          .whereRef('order_details.order_id', '=', 'orders.id')
          .as('e'),
        (join) => join.onTrue(),
      ).execute();

    return data as OrderWithDetail[];
  }

  async getInfo(id: string) {
    const data = await this.db.selectFrom('order_details')
      .selectAll()
      .where('order_id', '=', id)
      .leftJoinLateral(
        (eb) => eb.selectFrom('orders')
          .select([
            'ship_name',
            'ship_via',
            'freight',
            'order_date',
            'required_date',
            'shipped_date',
            'ship_city',
            'ship_region',
            'ship_postal_code',
            'ship_country',
            'customer_id',
          ])
          .whereRef('order_details.order_id', '=', 'orders.id')
          .as('o'),
        (join) => join.onTrue(),
      )
      .leftJoinLateral(
        (eb) => eb.selectFrom('products')
          .select(['id as p_id', 'name as p_name'])
          .whereRef('order_details.product_id', '=', 'products.id')
          .as('p'),
        (join) => join.onTrue(),
      )
      .execute() as any[];

    return data as OrderWithDetailAndProduct[];
  }
}
