import benny from 'benny';

import { Order } from '@/mikro-orm/entities/orders';
import { Detail } from '@/mikro-orm/entities/details';
import { Product } from '@/mikro-orm/entities/products';
import { Employee } from '@/mikro-orm/entities/employees';
import { Customer } from '@/mikro-orm/entities/customers';
import { Supplier } from '@/mikro-orm/entities/suppliers';

import { getConnection } from '@/mikro-orm';

export const startMikroOrmSuites = async () => {
  const db = await getConnection();

  await benny.suite(
    'MikroORM',

    benny.add('MikroORM Customers: getAll', async () => {
      await db.find(Customer, {});
    }),
    benny.add('MikroORM Customers: getInfo', async () => {
      await db.findOne(Customer, { id: 'ALFKI' });
    }),
    benny.add('MikroORM Customers: search', async () => {
      await db.find(Customer, {
        companyName: { $ilike: '%ha%' },
      });
    }),

    benny.add('MikroORM Employees: getAll', async () => {
      await db.find(Employee, {});
    }),
    benny.add('MikroORM Employees: getInfo', async () => {
      await db.findOne(
        Employee,
        { id: '1' },
        { populate: ['recipient'] },
      );
    }),

    benny.add('MikroORM Suppliers: getAll', async () => {
      await db.find(Supplier, {});
    }),
    benny.add('MikroORM Suppliers: getInfo', async () => {
      await db.findOne(Supplier, { id: '1' });
    }),

    benny.add('MikroORM Products: getAll', async () => {
      await db.find(Product, {});
    }),
    benny.add('MikroORM Products: getInfo', async () => {
      await db.findOne(
        Product,
        { id: '1' },
        { populate: ['supplier'] },
      );
    }),
    benny.add('MikroORM Products: search', async () => {
      await db.find(Product, {
        name: { $ilike: '%cha%' },
      });
    }),

    benny.add('MikroORM Orders: getAll', async () => {
      await db.find(
        Order,
        {},
        { populate: ['details'] },
      );
    }),
    benny.add('MikroORM Orders: getInfo', async () => {
      await db.find(
        Detail,
        { orderId: '10248' },
        { populate: ['order', 'product'] },
      );
    }),

    benny.cycle(),
    benny.complete(),
  );
};
