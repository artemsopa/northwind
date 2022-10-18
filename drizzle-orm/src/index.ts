import { PgConnector } from 'drizzle-orm-pg';
import { connect, migrate } from 'drizzle-orm';
import { Pool } from 'pg';
import { initConfigs } from '@/configs';
import { schema } from '@/data/schema';
import { CustomersController } from '@/controllers/customers';
import { EmployeesController } from '@/controllers/employees';
import { SuppliersController } from '@/controllers/suppliers';
import { ProductsController } from '@/controllers/products';
import { OrdersController } from '@/controllers/orders';
import { CustomersService } from '@/services/cutomers';
import { EmployeesService } from '@/services/employees';
import { OrdersService } from '@/services/orders';
import { ProductsService } from '@/services/products';
import { SuppliersService } from '@/services/suppliers';
import { App } from '@/app';

const main = async () => {
  try {
    const configs = initConfigs();

    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = configs.db;
    const pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    const connector = new PgConnector(pool, schema);
    const db = await connect(connector);
    console.log('Database successfully connected...');

    await migrate(connector, { migrationsFolder: 'migrations' });
    console.log('Database successfully migrated...');

    const customersService = new CustomersService(db);
    const employeesService = new EmployeesService(db);
    const suppliersService = new SuppliersService(db);
    const productsService = new ProductsService(db);
    const ordersService = new OrdersService(db);

    const { PORT } = configs.app;
    const app = new App(
      PORT,
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
