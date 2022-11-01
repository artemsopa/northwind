import bench from 'nanobench';

import { Customer } from '@/mikro-orm/entities/customers';
import { Employee } from '@/mikro-orm/entities/employees';
import { Supplier } from '@/mikro-orm/entities/suppliers';
import { Product } from '@/mikro-orm/entities/products';
import { Order } from '@/mikro-orm/entities/orders';
import { Detail } from '@/mikro-orm/entities/details';

import { getConnection } from '@/mikro-orm';

export const startMikroOrmBenches = async () => {
  const db = await getConnection();

  const count = new Array(1000);

  await bench('MikroORM Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(Customer, {});
    }
    b.end();
  });
  await bench('MikroORM Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.findOne(Customer, { id: 'ALFKI' });
    }
    b.end();
  });
  await bench('MikroORM Customers: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(Customer, {
        companyName: { $ilike: '%ha%' },
      });
    }
    b.end();
  });

  await bench('MikroORM Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(Employee, {});
    }
    b.end();
  });
  await bench('MikroORM Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.findOne(
        Employee,
        { id: '1' },
        { populate: ['recipient'] },
      );
    }
    b.end();
  });

  await bench('MikroORM Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(Supplier, {});
    }
    b.end();
  });
  await bench('MikroORM Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.findOne(Supplier, { id: '1' });
    }
    b.end();
  });

  await bench('MikroORM Products: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(Product, {});
    }
    b.end();
  });
  await bench('MikroORM Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.findOne(
        Product,
        { id: '1' },
        { populate: ['supplier'] },
      );
    }
    b.end();
  });
  await bench('MikroORM Products: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(Product, {
        name: { $ilike: '%cha%' },
      });
    }
    b.end();
  });

  await bench('MikroORM Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(
        Order,
        {},
        { populate: ['details'] },
      );
    }
    b.end();
  });
  await bench('MikroORM Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.find(
        Detail,
        { orderId: '10248' },
        { populate: ['order', 'product'] },
      );
    }
    b.end();
  });
};
