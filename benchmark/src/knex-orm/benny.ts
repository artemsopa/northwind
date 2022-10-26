import benny from 'benny';

import { getConnection } from '@/knex-orm';

export const startKnexOrmSuites = async () => {
  const db = await getConnection();

  await benny.suite(
    'Knex ORM',

    benny.add('Knex ORM Customers: getAll', async () => {
      await db('public.customers').select();
    }),
    benny.add('Knex ORM Customers: getInfo', async () => {
      await db('public.customers').where({ id: 'ALFKI' }).first();
    }),
    benny.add('Knex ORM Customers: search', async () => {
      await db('public.customers')
        .whereRaw('company_name ILIKE ?', ['%ha%']).select();
    }),

    benny.add('Knex ORM Employees: getAll', async () => {
      await db('public.employees').select();
    }),
    benny.add('Knex ORM Employees: getInfo', async () => {
      await db('public.employees as e1')
        .whereRaw('e1.id = (?)', ['1'])
        .leftJoin(
          'public.employees as e2',
          'e1.recipient_id',
          'e2.id',
        )
        .select(['e1.*', 'e2.id as e_id', 'e2.last_name as e_last_name', 'e2.first_name as e_first_name']);
    }),

    benny.add('Knex ORM Suppliers: getAll', async () => {
      await db('public.suppliers').select();
    }),
    benny.add('Knex ORM Suppliers: getInfo', async () => {
      await db('public.suppliers').where({ id: '1' }).first();
    }),

    benny.add('Knex ORM Products: getAll', async () => {
      await db('public.products').select();
    }),
    benny.add('Knex ORM Products: getInfo', async () => {
      await db('public.products')
        .select(['products.*', 'suppliers.id as s_id', 'suppliers.company_name as s_company_name'])
        .whereRaw('products.id = (?)', ['1'])
        .leftJoin(
          'public.suppliers',
          'products.supplier_id',
          'suppliers.id',
        );
    }),
    benny.add('Knex ORM Products: search', async () => {
      await db('public.products')
        .whereRaw('name ILIKE ?', ['%cha%']).select();
    }),
    benny.add('Knex ORM Orders: getAll', async () => {
      // Query with agregate columns
      await db('public.orders')
        .select([
          'orders.id',
          'orders.shipped_date',
          'orders.ship_name',
          'orders.ship_city',
          'orders.ship_country',
        ])
        .leftJoin(
          'public.order_details',
          'order_details.order_id',
          'orders.id',
        )
        .count('product_id as products')
        .sum('quantity as quantity')
        .sum(db.raw('?? * ??', ['quantity', 'unit_price']))
        .groupBy('orders.id')
        .orderBy('orders.id', 'asc');
    }),
    benny.add('Knex ORM Orders: getInfo', async () => {
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
    }),

    benny.cycle(),
    benny.complete(),
  );
};
