import dotenv from 'dotenv';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from '@/dtos';

const bench = require('nanobench');

dotenv.config();

const main = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Invalid environment variables!');
  }

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: DB_HOST,
        port: Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      }),
    }),
  });

  bench('Select employee with recipient by id 10 times', async (b: any) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      await db.selectFrom('employees as e1')
        .selectAll()
        .where('e1.id', '=', '1')
        .limit(1)
        .leftJoinLateral(
          (eb) => eb.selectFrom('employees as e2')
            .select(['id as e_id', 'last_name as e_last_name', 'first_name as e_first_name'])
            .whereRef('e1.recipient_id', '=', 'e2.id')
            .as('e2'),
          (join) => join.onTrue(),
        )
        .execute();
    }

    b.end();
  });

  bench('Select order_details with orders and products 10 times', async (b: any) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      await db.selectFrom('order_details')
        .selectAll()
        .where('order_id', '=', '10248')
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
        .execute();
    }

    b.end();
  });
};

main();