import { SQS } from 'aws-sdk';
import { PgConnector } from 'drizzle-orm-pg';
import { connect, migrate } from 'drizzle-orm';
import { Pool } from 'pg';
import express, { Router } from 'express';
import cors from 'cors';
import initConfigs from './configs/configs';
import { schema } from './internal/repositories/entities/schema';
import { Queue } from './pkg/queue';
import { CustomersRoute } from './internal/delivery/routes/customers';
import { EmployeesRoute } from './internal/delivery/routes/employees';
import { SuppliersRoute } from './internal/delivery/routes/suppliers';
import { ProductsRoute } from './internal/delivery/routes/products';
import { OrdersRoute } from './internal/delivery/routes/orders';
import { MetricsRoute } from './internal/delivery/routes/metrics';
import errorMiddleware from './internal/delivery/middlewares/error';
import notfMiddleware from './internal/delivery/middlewares/notfound';
import { MetricsRepo } from './internal/repositories/metrics';
import { CustomersRepo } from './internal/repositories/customers';
import { DetailsRepo } from './internal/repositories/details';
import { EmployeesRepo } from './internal/repositories/employees';
import { OrdersRepo } from './internal/repositories/orders';
import { ProductsRepo } from './internal/repositories/products';
import { SuppliersRepo } from './internal/repositories/suppliers';
import { CustomersService } from './internal/services/cutomers';
import { EmployeesService } from './internal/services/employees';
import { MetricsService } from './internal/services/metrics';
import { OrdersService } from './internal/services/orders';
import { ProductsService } from './internal/services/products';
import { SuppliersService } from './internal/services/suppliers';

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
    const repos = {
      metrics: new MetricsRepo(db),
      customers: new CustomersRepo(db),
      employees: new EmployeesRepo(db),
      orders: new OrdersRepo(db),
      details: new DetailsRepo(db),
      products: new ProductsRepo(db),
      suppliers: new SuppliersRepo(db),
    };

    const services = {
      metrics: new MetricsService(repos.metrics),
      customers: new CustomersService(repos.customers, queue),
      employees: new EmployeesService(repos.employees, queue),
      suppliers: new SuppliersService(repos.suppliers, queue),
      products: new ProductsService(repos.products, queue),
      orders: new OrdersService(repos.orders, queue),
    };

    const routes = Router()
      .use('/metrics', new MetricsRoute(services.metrics).initRoutes())
      .use('/customers', new CustomersRoute(services.customers).initRoutes())
      .use('/employees', new EmployeesRoute(services.employees).initRoutes())
      .use('/suppliers', new SuppliersRoute(services.suppliers).initRoutes())
      .use('/products', new ProductsRoute(services.products).initRoutes())
      .use('/orders', new OrdersRoute(services.orders).initRoutes());

    const server = express()
      .use(cors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        optionsSuccessStatus: 204,
      }))
      .use(express.json())
      .use(routes)
      .use(errorMiddleware)
      .use(notfMiddleware);

    const { PORT } = configs.app;
    server.listen(PORT, () => console.log(`Server successfully started on ${PORT}...`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
