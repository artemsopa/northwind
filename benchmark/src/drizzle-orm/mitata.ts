import { run, bench, group, baseline } from 'mitata';
import { eq, ilike } from 'drizzle-orm/expressions';

import { getConnection } from './index';
import { customers, details, orders, products, suppliers } from '@/drizzle-orm/data/schema';
import { sql } from 'drizzle-orm';

export const startDrizzleOrmBenches = async () => {
  const db = await getConnection();
  const count = new Array(1000);

  group('Drizzle-ORM', async () => {
    bench('Drizzle-ORM Customers: getAll', async () => {
      for await (const i of count) await db.customers.select().execute();
    });
    bench('Drizzle-ORM Customers: getInfo', async () => {
      for await (const i of count) {
        await db.customers.select()
          .where(eq(customers.id, 'ALFKI'))
          .execute();
      }
    });
    bench('Drizzle-ORM Customers: search', async () => {
      for await (const i of count) {
        await db.customers.select()
          .where(ilike(customers.companyName, `%${'ha'}%`))
          .execute();
      }
    });

    bench('Drizzle-ORM Employees: getAll', async () => {
      for await (const i of count) await db.employees.select().execute();
    });
    bench('Drizzle-ORM Employees: getInfo', async () => {
      for await (const i of count) {
        const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname"
            from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = '1'`;

        await db.execute(command);
      }
    });

    bench('Drizzle-ORM Suppliers: getAll', async () => {
      for await (const i of count) await db.suppliers.select().execute();
    });
    bench('Drizzle-ORM Suppliers: getInfo', async () => {
      for await (const i of count) {
        await db.suppliers.select()
          .where(eq(suppliers.id, '1'))
          .execute();
      }
    });

    bench('Drizzle-ORM Products: getAll', async () => {
      for await (const i of count) {
        await db.products.select().execute();
      }
    });
    bench('Drizzle-ORM Products: getInfo', async () => {
      for await (const i of count) {
        await db.products.select()
          .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
          .where(eq(products.id, '1'))
          .execute();
      }
    });
    bench('Drizzle-ORM Products: search', async () => {
      for await (const i of count) {
        await db.products.select()
          .where(ilike(products.name, `%${'cha'}%`))
          .execute();
      }
    });

    bench('Drizzle-ORM Orders: getAll', async () => {
      for await (const i of count) {
        const command = sql`select "id", "shipped_date", "ship_name", "ship_city", "ship_country",
              count("product_id") as "products", sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price"
              from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`;

        await db.execute(command);
      }
    });
    bench('Drizzle-ORM Orders: getInfo', async () => {
      for await (const i of count) {
        await db.details.select()
          .leftJoin(orders, eq(details.orderId, orders.id))
          .leftJoin(products, eq(details.productId, orders.id))
          .where(eq(details.orderId, '10248'))
          .execute();
      }
    });
  });
  await run();
};

// startDrizzleOrmBenches();
