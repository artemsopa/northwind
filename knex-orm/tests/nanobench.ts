import dotenv from 'dotenv';
import knex from 'knex';

const bench = require('nanobench');

dotenv.config();

const main = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Invalid environment variables!');
  }

  const db = knex({
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: 'migrations',
    },
    useNullAsDefault: true,
  });

  bench('Select employee with recipient by id 10 times', async (b: any) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      await db('public.employees as e1')
        .whereRaw('e1.id = (?)', ['1'])
        .leftJoin(
          'public.employees as e2',
          'e1.recipient_id',
          'e2.id',
        )
        .select(['e1.*', 'e2.id as e_id', 'e2.last_name as e_last_name', 'e2.first_name as e_first_name']);
    }

    b.end();
  });

  bench('Select order_details with orders and products 10 times', async (b: any) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      await db('public.order_details as od')
        .whereRaw('od.order_id = (?)', ['10248'])
        .leftJoin(
          'public.orders as o',
          'o.id',
          'od.order_id',
        )
        .leftJoin(
          'public.products as p',
          'p.id',
          'od.product_id',
        )
        .select([
          'o.*',

          'od.unit_price as od_uprice',
          'od.quantity as od_quantity',
          'od.discount as od_discount',

          'p.id as p_id',
          'p.name as p_name',
        ]);
    }

    b.end();
  });
};

main();
