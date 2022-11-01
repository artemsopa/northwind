import { run, bench, group } from 'mitata';
import { Customer } from './entities/customers';
import { Detail } from './entities/details';
import { Employee } from './entities/employees';
import { Order } from './entities/orders';
import { Product } from './entities/products';
import { Supplier } from './entities/suppliers';
import { getConnection } from './index';

export const startMikroOrmBenches = async () => {
  const db = await getConnection();
  const count = new Array(1000);

  group('MikroORM', async () => {
    bench('MikroORM Customers: getAll', async () => {
      for await (const i of count) await db.find(Customer, {});
    });
    bench('MikroORM Customers: getInfo', async () => {
      for await (const i of count) await db.findOne(Customer, { id: 'ALFKI' });
    });
    bench('MikroORM Customers: search', async () => {
      for await (const i of count) {
        await db.find(Customer, {
            companyName: { $ilike: '%ha%' },
          });
      }
    });
    bench('MikroORM Employees: getAll', async () => {
      for await (const i of count) await db.find(Employee, {});
    });
    bench('MikroORM Employees: getInfo', async () => {
      for await (const i of count) {
        await db.findOne(
            Employee,
            { id: '1' },
            { populate: ['recipient'] },
          );
      }
    });
    bench('MikroORM Suppliers: getAll', async () => {
      for await (const i of count) await db.find(Supplier, {});
    });
    bench('MikroORM Suppliers: getInfo', async () => {
      for await (const i of count) await db.findOne(Supplier, { id: '1' });
    });
    bench('MikroORM Products: getAll', async () => {
      for await (const i of count) await db.find(Product, {});
    });
    bench('MikroORM Products: getInfo', async () => {
      for await (const i of count) {
        await db.findOne(
            Product,
            { id: '1' },
            { populate: ['supplier'] },
          );
      }
    });
    bench('MikroORM Products: search', async () => {
      for await (const i of count) {
        await db.find(Product, {
            name: { $ilike: '%cha%' },
          });
      }
    });
    bench('MikroORM Orders: getAll', async () => {
      for await (const i of count) {
        await db.find(
            Order,
            {},
            { populate: ['details'] },
          );
      }
    });
    bench('MikroORM Orders: getInfo', async () => {
      for await (const i of count) {
        await db.find(
            Detail,
            { orderId: '10248' },
            { populate: ['order', 'product'] },
          );
      }
    });
  });

  await run();
};

// startMikroOrmBenches();
