import fs from 'fs/promises';
import path from 'path';
import { Pool } from 'pg';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { initConfigs } from '@/configs';
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
import { Database } from '@/dtos';

const main = async () => {
  try {
    const configs = initConfigs();

    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = configs.db;
    const db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
        }),
      }),
    });
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: 'migrations',
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(`Migration "${it.migrationName}" was executed successfully!`);
      } else if (it.status === 'Error') {
        console.error(`Failed to execute migration "${it.migrationName}!"`);
      }
    });

    console.log('Database successfully connected...');

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
