import { SQS } from 'aws-sdk';
import { PgConnector } from 'drizzle-orm-pg';
import { connect, migrate } from 'drizzle-orm';
import { Pool } from 'pg';
import initConfigs from '@/configs/configs';
import { schema } from '@/internal/repositories/entities/schema';
import { Queue } from '@/pkg/queue';
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

    const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_SQS_URL } = configs.aws;
    const sqs = new SQS({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION,
    });

    const queue = new Queue(sqs, AWS_SQS_URL);

    const metricsRepo = new MetricsRepo(db);
    const customersRepo = new CustomersRepo(db);
    const employeesRepo = new EmployeesRepo(db);
    const ordersRepo = new OrdersRepo(db);
    const productsRepo = new ProductsRepo(db);
    const suppliersRepo = new SuppliersRepo(db);

    const metricsService = new MetricsService(metricsRepo);
    const customersService = new CustomersService(customersRepo, queue);
    const employeesService = new EmployeesService(employeesRepo, queue);
    const suppliersService = new SuppliersService(suppliersRepo, queue);
    const productsService = new ProductsService(productsRepo, queue);
    const ordersService = new OrdersService(ordersRepo, queue);

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
