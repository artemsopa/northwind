import bench from 'nanobench';

import { sql } from 'kysely';
import { getConnection } from '@/kysely-orm';

export const startKyselyOrmBenches = async () => {
  const db = await getConnection();

  const count = new Array(1000);

  await bench('Kysely ORM Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('customers').selectAll().execute();
    }
    b.end();
  });
  await bench('Kysely ORM Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('customers')
        .selectAll()
        .where('customers.id', '=', 'ALFKI')
        .limit(1)
        .execute();
    }
    b.end();
  });
  await bench('Kysely ORM Customers: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('customers')
        .selectAll()
        .where(sql`company_name`, 'ilike', '%ha%')
        .execute();
    }
    b.end();
  });

  await bench('Kysely ORM Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('employees').selectAll().execute();
    }
    b.end();
  });
  await bench('Kysely ORM Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
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

  await bench('Kysely ORM Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('suppliers').selectAll().execute();
    }
    b.end();
  });
  await bench('Kysely ORM Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('suppliers')
        .selectAll()
        .where('suppliers.id', '=', '1')
        .limit(1)
        .execute();
    }
    b.end();
  });

  await bench('Kysely ORM Products: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('products').selectAll().execute();
    }
    b.end();
  });
  await bench('Kysely ORM Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('products')
        .selectAll()
        .where('products.id', '=', '1')
        .limit(1)
        .leftJoinLateral(
          (eb) => eb.selectFrom('suppliers')
            .select(['suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
            .whereRef('suppliers.id', '=', 'products.supplier_id')
            .as('s1'),
          (join) => join.onTrue(),
        )
        .execute();
    }
    b.end();
  });
  await bench('Kysely ORM Products: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('products')
        .selectAll()
        .where(sql`name`, 'ilike', `%${'cha'.toLowerCase()}%`)
        .execute();
    }
    b.end();
  });

  await bench('Kysely ORM Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.selectFrom('orders')
        .selectAll()
        .leftJoinLateral(
          (eb) => eb.selectFrom('order_details')
            .select(['quantity', 'unit_price'])
            .whereRef('order_details.order_id', '=', 'orders.id')
            .as('e'),
          (join) => join.onTrue(),
        ).execute();
    }
    b.end();
  });
  await bench('Kysely ORM Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
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
