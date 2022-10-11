import { SQS } from 'aws-sdk';
import { PgConnector } from 'drizzle-orm-pg';
import { connect, migrate } from 'drizzle-orm';
import { Pool } from 'pg';
import express, { Router } from 'express';
import cors from 'cors';
import initConfigs from './configs/configs';
import { schema } from './internal/repositories/entities/schema';
import { Queue } from './pkg/queue';
import { initRepositories } from './internal/repositories/repositories';
import { initServices } from './internal/services/services';
import { CustomersRoute } from './internal/delivery/routes/customers.routes';
import { EmployeesRoute } from './internal/delivery/routes/employees.route';
import { SuppliersRoute } from './internal/delivery/routes/suppliers.route';
import { ProductsRoute } from './internal/delivery/routes/products.route';
import { OrdersRoute } from './internal/delivery/routes/orders.route';
import { MetricsRoute } from './internal/delivery/routes/metrics.route';
import errorMiddleware from './internal/delivery/middlewares/error.mware';
import notfMiddleware from './internal/delivery/middlewares/notf.mware';

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

    await migrate(connector, { migrationsFolder: '../migrations' });

    const { AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_SQS_URL } = configs.aws;
    const sqs = new SQS({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION,
    });

    const queue = new Queue(sqs, AWS_SQS_URL);
    const repos = initRepositories(db);

    const services = initServices(repos, queue);

    const routes = Router()
      .use('/admin', new MetricsRoute(services.metrics).initRoutes())
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
