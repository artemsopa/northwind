import knex from 'knex';
import pg from 'pg';
import { initConfigs } from '@/configs';
import { CustomersController } from '@/controllers/customers';
import { EmployeesController } from '@/controllers/employees';
import { SuppliersController } from '@//controllers/suppliers';
import { ProductsController } from '@/controllers/products';
import { OrdersController } from '@/controllers/orders';
import { MetricsController } from '@/controllers/metrics';
import { CustomersService } from '@/services/cutomers';
import { EmployeesService } from '@/services/employees';
import { MetricsService } from '@/services/metrics';
import { OrdersService } from '@/services/orders';
import { ProductsService } from '@/services/products';
import { SuppliersService } from '@/services/suppliers';
import { App } from '@/app';

const main = async () => {
  try {
    const configs = initConfigs();

    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = configs.db;
    pg.types.setTypeParser(1700, 'text', parseFloat);
    const db = knex({
      client: 'pg',
      connection: {
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      },
      pool: {
        min: 1,
        max: 10,
      },
      migrations: {
        tableName: 'migrations',
        directory: 'migrations',
      },
      useNullAsDefault: true,
    });
    console.log('Database successfully migrated...');

    db.on('query', (query) => {
      console.log(String(`${query.sql} ${query.bindings}`));
    });

    const metricsService = new MetricsService(db);
    const customersService = new CustomersService(db);
    const employeesService = new EmployeesService(db);
    const suppliersService = new SuppliersService(db);
    const productsService = new ProductsService(db);
    const ordersService = new OrdersService(db);

    const { PORT } = configs.app;
    const app = new App(
      PORT,
      new MetricsController(metricsService),
      new CustomersController(customersService),
      new EmployeesController(employeesService),
      new SuppliersController(suppliersService),
      new ProductsController(productsService),
      new OrdersController(ordersService),
    );

    app.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
