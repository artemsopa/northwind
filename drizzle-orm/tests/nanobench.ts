import dotenv from 'dotenv';
import { connect, sql } from 'drizzle-orm';
import { PgConnector } from 'drizzle-orm-pg';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm/expressions';
import { orders as table, details, products, schema } from '@/data/schema';

const bench = require('nanobench');

dotenv.config();

const main = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Invalid environment variables!');
  }

  const pool = new Pool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  const connector = new PgConnector(pool, schema);
  const db = await connect(connector);

  bench('Select employee with recipient by id 10 times', async (b: any) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" 
      from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = ${'1'}`;

      await db.execute(command);
    }

    b.end();
  });

  bench('Select order_details with orders and products 10 times', async (b: any) => {
    b.start();

    for (let i = 0; i < 10; i++) {
      await db.details.select()
        .leftJoin(table, eq(details.orderId, table.id))
        .leftJoin(products, eq(details.productId, products.id))
        .where(eq(details.orderId, '10248'))
        .execute();
    }

    b.end();
  });
};

main();