import fs from 'fs/promises';
import path from 'path';
import { Pool } from 'pg';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { initConfigs } from '@/configs/configs';
import { CustomersController } from '@/internal/delivery/controllers/customers';
import { EmployeesController } from '@/internal/delivery/controllers/employees';
import { SuppliersController } from '@/internal/delivery/controllers/suppliers';
import { ProductsController } from '@/internal/delivery/controllers/products';
import { OrdersController } from '@/internal/delivery/controllers/orders';
import { MetricsController } from '@/internal/delivery/controllers/metrics';
import { MetricsRepo } from '@/internal/repositories/metrics';
import { CustomersRepo } from '@/internal/repositories/customers';
import { EmployeesRepo } from '@/internal/repositories/employees';
import { OrdersRepo } from '@/internal/repositories/orders';
import { ProductsRepo } from '@/internal/repositories/products';
import { SuppliersRepo } from '@/internal/repositories/suppliers';
import { CustomersService } from '@/internal/services/cutomers';
import { EmployeesService } from '@/internal/services/employees';
import { MetricsService } from '@/internal/services/metrics';
import { OrdersService } from '@/internal/services/orders';
import { ProductsService } from '@/internal/services/products';
import { SuppliersService } from '@/internal/services/suppliers';
import { App } from '@/internal/delivery/app';
import { Database } from '@/internal/repositories/interfaces/interfaces';

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

    const metricsRepo = new MetricsRepo(db);
    const customersRepo = new CustomersRepo(db);
    const employeesRepo = new EmployeesRepo(db);
    const ordersRepo = new OrdersRepo(db);
    const productsRepo = new ProductsRepo(db);
    const suppliersRepo = new SuppliersRepo(db);

    const metricsService = new MetricsService(metricsRepo);
    const customersService = new CustomersService(customersRepo);
    const employeesService = new EmployeesService(employeesRepo);
    const suppliersService = new SuppliersService(suppliersRepo);
    const productsService = new ProductsService(productsRepo);
    const ordersService = new OrdersService(ordersRepo);

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
