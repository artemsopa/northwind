import bench from 'nanobench';
import { CustomersService } from '@/drizzle-orm/src/services/cutomers';
import { EmployeesService } from '@/drizzle-orm/src/services/employees';
import { SuppliersService } from '@/drizzle-orm/src/services/suppliers';
import { ProductsService } from '@/drizzle-orm/src/services/products';
import { OrdersService } from '@/drizzle-orm/src/services/orders';

import { getConnection } from '@/drizzle-orm';

export const startDrizzleOrmBenches = async () => {
  const db = await getConnection();

  const customers = new CustomersService(db);
  const employees = new EmployeesService(db);
  const suppliers = new SuppliersService(db);
  const products = new ProductsService(db);
  const orders = new OrdersService(db);

  const count = new Array(1000);

  await bench('Drizzle-ORM Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) await customers.getAll();
    b.end();
  });
  await bench('Drizzle-ORM Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) await customers.getInfo('ALFKI');
    b.end();
  });
  await bench('Drizzle-ORM Customers: search', async (b) => {
    b.start();
    for await (const i of count) await customers.search('ha');
    b.end();
  });

  await bench('Drizzle-ORM Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) await employees.getAll();
    b.end();
  });
  await bench('Drizzle-ORM Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) await employees.getInfo('1');
    b.end();
  });

  await bench('Drizzle-ORM Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) await suppliers.getAll();
    b.end();
  });
  await bench('Drizzle-ORM Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) await suppliers.getInfo('1');
    b.end();
  });

  await bench('Drizzle-ORM Products: getAll', async (b) => {
    b.start();
    for await (const i of count) await products.getAll();
    b.end();
  });
  await bench('Drizzle-ORM Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) await products.getInfo('1');
    b.end();
  });
  await bench('Drizzle-ORM Products: search', async (b) => {
    b.start();
    for await (const i of count) await products.search('cha');
    b.end();
  });

  await bench('Drizzle-ORM Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) await orders.getAll(); // Query with agregate columns
    b.end();
  });
  await bench('Drizzle-ORM Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) await orders.getInfo('10248');
    b.end();
  });
};
