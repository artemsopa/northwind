import Benchmark from 'benchmark';
import { CustomersService } from '@/knex-orm/src/services/cutomers';
import { EmployeesService } from '@/knex-orm/src/services/employees';
import { SuppliersService } from '@/knex-orm/src/services/suppliers';
import { ProductsService } from '@/knex-orm/src/services/products';
import { OrdersService } from '@/knex-orm/src/services/orders';

import { getConnection } from '@/knex-orm';

export const startKnexOrmSuite = async () => {
  const db = await getConnection();

  const customers = new CustomersService(db);
  const employees = new EmployeesService(db);
  const suppliers = new SuppliersService(db);
  const products = new ProductsService(db);
  const orders = new OrdersService(db);

  const suite = new Benchmark.Suite();

  suite
    .add('Knex ORM Customers: getAll', async () => {
      await customers.getAll();
    })
    .add('Knex ORM Customers: getInfo', async () => {
      await customers.getInfo('ALFKI');
    })
    .add('Knex ORM Customers: search', async () => {
      await customers.search('ha');
    })

    .add('Knex ORM Employees: getAll', async () => {
      await employees.getAll();
    })
    .add('Knex ORM Employees: getInfo', async () => {
      await employees.getInfo('1');
    })

    .add('Knex ORM Suppliers: getAll', async () => {
      await suppliers.getAll();
    })
    .add('Knex ORM Suppliers: getInfo', async () => {
      await suppliers.getInfo('1');
    })

    .add('Knex ORM Products: getAll', async () => {
      await products.getAll();
    })
    .add('Knex ORM Products: getInfo', async () => {
      await products.getInfo('1');
    })
    .add('Knex ORM Products: search', async () => {
      await products.search('cha');
    })

    .add('Knex ORM Orders: getAll', async () => {
      await orders.getAll(); // Query with agregate columns
    })
    .add('Knex ORM Orders: getInfo', async () => {
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
