import benny from 'benny';

import { getConnection } from '@/pg';

export const startPgDriverSuites = async () => {
  const db = await getConnection();

  await benny.suite(
    'Pg Driver',

    benny.add('Pg Driver Customers: getAll', async () => {
      await db.query('select * from "customers"');
    }),
    benny.add('Pg Driver Customers: getInfo', async () => {
      await db.query('select * from "customers" where "customers"."id" = $1', ['ALFKI']);
    }),
    benny.add('Pg Driver Customers: search', async () => {
      await db.query('select * from "customers" where "customers"."company_name" ilike $1', ['ha']);
    }),

    benny.add('Pg Driver Employees: getAll', async () => {
      await db.query('select * from "employees"');
    }),
    benny.add('Pg Driver Employees: getInfo', async () => {
      await db.query(`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" 
        from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = $1`, ['1']);
    }),

    benny.add('Pg Driver Suppliers: getAll', async () => {
      await db.query('select * from "suppliers"');
    }),
    benny.add('Pg Driver Suppliers: getInfo', async () => {
      await db.query('select * from "suppliers" where "suppliers"."id" = $1', ['1']);
    }),

    benny.add('Pg Driver Products: getAll', async () => {
      await db.query('select * from "products"');
    }),
    benny.add('Pg Driver Products: getInfo', async () => {
      await db.query(`select "products".*, "suppliers".* 
        from "products" left join "suppliers" on "products"."supplier_id" = "suppliers"."id" where "products"."id" = $1`, ['1']);
    }),
    benny.add('Pg Driver Products: search', async () => {
      await db.query('select * from "products" where "products"."name" ilike $1', ['cha']);
    }),

    benny.add('Pg Driver Orders: getAll', async () => {
      await db.query(`select "id", "shipped_date", "ship_name", "ship_city", "ship_country", count("product_id") as "products", 
        sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price" 
        from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`);
    }),
    benny.add('Pg Driver Orders: getInfo', async () => {
      await db.query(`select "order_details"."unit_price", "order_details"."quantity", "order_details"."discount", "order_details"."order_id", 
        "order_details"."product_id", "orders"."id", "orders"."order_date", "orders"."required_date", "orders"."shipped_date", "orders"."ship_via", 
        "orders"."freight", "orders"."ship_name", "orders"."ship_city", "orders"."ship_region", "orders"."ship_postal_code", "orders"."ship_country", 
        "orders"."customer_id", "orders"."employee_id", "products"."id", "products"."name", "products"."qt_per_unit", "products"."unit_price", 
        "products"."units_in_stock", "products"."units_on_order", "products"."reorder_level", "products"."discontinued", "products"."supplier_id" 
        from "order_details" left join "orders" on "order_details"."order_id" = "orders"."id" 
        left join "products" on "order_details"."product_id" = "products"."id" where "order_details"."order_id" = $1`, ['10248']);
    }),

    benny.cycle(),
    benny.complete(),
  );
};
