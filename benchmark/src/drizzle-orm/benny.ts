import benny from 'benny';
import { eq, ilike } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { customers, details, orders, products, suppliers } from './data/schema';

import { getConnection } from './index';

export const startDrizzleOrmSuites = async () => {
  const db = await getConnection();

  await benny.suite(
    'Drizzle-ORM Customers',

    benny.add('Drizzle-ORM Customers: getAll', async () => {
      await db.customers.select().execute();
    }),
    benny.add('Drizzle-ORM Customers: getInfo', async () => {
      await db.customers.select()
        .where(eq(customers.id, 'ALFKI'))
        .execute();
    }),
    benny.add('Drizzle-ORM Customers: search', async () => {
      await db.customers.select()
        .where(ilike(customers.companyName, `%${'ha'}%`))
        .execute();
    }),

    benny.add('Drizzle-ORM Employees: getAll', async () => {
      await db.employees.select().execute();
    }),
    benny.add('Drizzle-ORM Employees: getInfo', async () => {
      const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname"
        from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = '1'`;

      await db.execute(command);
    }),

    benny.add('Drizzle-ORM Suppliers: getAll', async () => {
      await db.suppliers.select().execute();
    }),
    benny.add('Drizzle-ORM Suppliers: getInfo', async () => {
      await db.suppliers.select()
        .where(eq(suppliers.id, '1'))
        .execute();
    }),

    benny.add('Drizzle-ORM Products: getAll', async () => {
      await db.products.select().execute();
    }),
    benny.add('Drizzle-ORM Products: getInfo', async () => {
      await db.products.select()
        .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
        .where(eq(products.id, '1'))
        .execute();
    }),
    benny.add('Drizzle-ORM Products: search', async () => {
      await db.products.select()
        .where(ilike(products.name, `%${'cha'}%`))
        .execute();
    }),

    benny.add('Drizzle-ORM Orders: getAll', async () => {
      const command = sql`select "id", "shipped_date", "ship_name", "ship_city", "ship_country",
      count("product_id") as "products", sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price"
      from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`;

      await db.execute(command);
    }),
    benny.add('Drizzle-ORM Orders: getInfo', async () => {
      await db.details.select()
        .leftJoin(orders, eq(details.orderId, orders.id))
        .leftJoin(products, eq(details.productId, orders.id))
        .where(eq(details.orderId, '10248'))
        .execute();
    }),

    benny.cycle(),
    benny.complete(),
  );
};
