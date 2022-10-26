import bench from 'nanobench';

import { getConnection } from '@/pg';

export const startPgDriverBenches = async () => {
  const db = await getConnection();

  const count = new Array(1000);

  await bench('Pg Driver Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "customers"');
    b.end();
  });
  await bench('Pg Driver Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "customers" where "customers"."id" = $1', ['ALFKI']);
    b.end();
  });
  await bench('Pg Driver Customers: search', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "customers" where "customers"."company_name" ilike $1', ['ha']);
    b.end();
  });

  await bench('Pg Driver Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "employees"');
    b.end();
  });
  await bench('Pg Driver Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.query(`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" 
        from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = $1`, ['1']);
    }
    b.end();
  });

  await bench('Pg Driver Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "suppliers"');
    b.end();
  });
  await bench('Pg Driver Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "suppliers" where "suppliers"."id" = $1', ['1']);
    b.end();
  });

  await bench('Pg Driver Products: getAll', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "products"');
    b.end();
  });
  await bench('Pg Driver Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.query(`select "products".*, "suppliers".* 
        from "products" left join "suppliers" on "products"."supplier_id" = "suppliers"."id" where "products"."id" = $1`, ['1']);
    }
    b.end();
  });
  await bench('Pg Driver Products: search', async (b) => {
    b.start();
    for await (const i of count) await db.query('select * from "products" where "products"."name" ilike $1', ['cha']);
    b.end();
  });

  await bench('Pg Driver Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.query(`select "id", "shipped_date", "ship_name", "ship_city", "ship_country", count("product_id") as "products", 
        sum("quantity") as "quantity", sum("quantity" * "unit_price") as "total_price" 
        from "orders" as "o" left join "order_details" as "od" on "od"."order_id" = "o"."id" group by "o"."id" order by "o"."id" asc`);
    }
    b.end();
  });
  await bench('Pg Driver Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.query(`select "order_details"."unit_price", "order_details"."quantity", "order_details"."discount", "order_details"."order_id", 
        "order_details"."product_id", "orders"."id", "orders"."order_date", "orders"."required_date", "orders"."shipped_date", "orders"."ship_via", 
        "orders"."freight", "orders"."ship_name", "orders"."ship_city", "orders"."ship_region", "orders"."ship_postal_code", "orders"."ship_country", 
        "orders"."customer_id", "orders"."employee_id", "products"."id", "products"."name", "products"."qt_per_unit", "products"."unit_price", 
        "products"."units_in_stock", "products"."units_on_order", "products"."reorder_level", "products"."discontinued", "products"."supplier_id" 
        from "order_details" left join "orders" on "order_details"."order_id" = "orders"."id" 
        left join "products" on "order_details"."product_id" = "products"."id" where "order_details"."order_id" = $1`, ['10248']);
    }
    b.end();
  });
};
