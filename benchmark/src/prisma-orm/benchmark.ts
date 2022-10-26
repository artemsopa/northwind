import Benchmark from 'benchmark';
import { CustomersService } from '@/prisma-orm/src/services/cutomers';
import { EmployeesService } from '@/prisma-orm/src/services/employees';
import { SuppliersService } from '@/prisma-orm/src/services/suppliers';
import { ProductsService } from '@/prisma-orm/src/services/products';
import { OrdersService } from '@/prisma-orm/src/services/orders';

import { getConnection } from '@/prisma-orm';

export const startPrismaOrmSuite = async () => {
  const db = await getConnection();

  const customers = new CustomersService(db);
  const employees = new EmployeesService(db);
  const suppliers = new SuppliersService(db);
  const products = new ProductsService(db);
  const orders = new OrdersService(db);

  const suite = new Benchmark.Suite();

  suite
    .add('Prisma-ORM Customers: getAll', async () => {
      await customers.getAll();
    })
    .add('Prisma-ORM Customers: getInfo', async () => {
      await customers.getInfo('ALFKI');
    })
    .add('Prisma-ORM Customers: search', async () => {
      await customers.search('ha');
    })

    .add('Prisma-ORM Employees: getAll', async () => {
      await employees.getAll();
    })
    .add('Prisma-ORM Employees: getInfo', async () => {
      await employees.getInfo('1');
    })

    .add('Prisma-ORM Suppliers: getAll', async () => {
      await suppliers.getAll();
    })
    .add('Prisma-ORM Suppliers: getInfo', async () => {
      await suppliers.getInfo('1');
    })

    .add('Prisma-ORM Products: getAll', async () => {
      await products.getAll();
    })
    .add('Prisma-ORM Products: getInfo', async () => {
      await products.getInfo('1');
    })
    .add('Prisma-ORM Products: search', async () => {
      await products.search('cha');
    })

    .add('Prisma-ORM Orders: getAll', async () => {
      await orders.getAll();
    })
    .add('Prisma-ORM Orders: getInfo', async () => {
      await orders.getInfo('10248');
    })

    .on('cycle', (event) => {
      console.log(String(event.target));
    })
    .on('complete', () => {
      console.log(`Fastest is ${suite.filter('fastest').map('name')}`);
    })
    .run({ async: true });
};
