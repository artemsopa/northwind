import bench from 'nanobench';

import { eq, ilike } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { customers, details, orders, products, suppliers } from './data/schema';

import { getConnection } from './index';

export const startDrizzleOrmBenches = async () => {
  const db = await getConnection();

  const count = new Array(1000);

  const query = db.customers.select();
  // await bench('Drizzle-ORM Customers: getAll ', async (b) => {
  //   b.start();
  //   for await (const i of count) await query.execute();
  //   b.end();
  // });
  // await bench('Drizzle-ORM Customers: getAll 2', async (b) => {
  //   b.start();
  //   for await (const i of count) await db.customers.select().execute();
  //   b.end();
  // });
  // await bench('Drizzle-ORM Customers: getAll 3', async (b) => {
  //   b.start();
  //   const command = sql`select * from "customers"`;
  //   for await (const i of count) await db.execute(command);
  //   b.end();
  // });

  await bench('Drizzle-ORM Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.customers.select().execute();
    b.end();
  });
  await bench('Drizzle-ORM Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.customers.select()
        .where(eq(customers.id, 'ALFKI'))
        .execute();
    }
    b.end();
  });
  await bench('Drizzle-ORM Customers: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.customers.select()
        .where(ilike(customers.companyName, `%${'ha'}%`))
        .execute();
    }
    b.end();
  });

  await bench('Drizzle-ORM Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.employees.select().execute();
    b.end();
  });
  await bench('Drizzle-ORM Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname"
        from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = '1'`;

      await db.execute(command);
    }
    b.end();
  });

  await bench('Drizzle-ORM Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.suppliers.select().execute();
    b.end();
  });
  await bench('Drizzle-ORM Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.suppliers.select()
        .where(eq(suppliers.id, '1'))
        .execute();
    }
    b.end();
  });

  await bench('Drizzle-ORM Products: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.products.select().execute();
    b.end();
  });
  await bench('Drizzle-ORM Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.products.select()
        .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
        .where(eq(products.id, '1'))
        .execute();
    }
    b.end();
  });
  await bench('Drizzle-ORM Products: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.products.select()
        .where(ilike(products.name, `%${'cha'}%`))
        .execute();
    }
    b.end();
  });

  await bench('Drizzle-ORM Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      const command = sql`select "id", "shipped_date", "ship_name", "ship_city", "ship_country",
      count("product_id") as "products", sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price"
      from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`;

      await db.execute(command);
    }
    b.end();
  });
  await bench('Drizzle-ORM Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.details.select()
        .leftJoin(orders, eq(details.orderId, orders.id))
        .leftJoin(products, eq(details.productId, orders.id))
        .where(eq(details.orderId, '10248'))
        .execute();
    }
    b.end();
  });
};

// startDrizzleOrmBenches();