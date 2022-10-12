import 'reflect-metadata';
import { DataSource } from 'typeorm';
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
import { Customer } from './internal/repositories/entities/customers';
import { Employee } from './internal/repositories/entities/employees';
import { Order } from './internal/repositories/entities/orders';
import { Supplier } from './internal/repositories/entities/suppliers';
import { Product } from './internal/repositories/entities/products';
import { Metric } from './internal/repositories/entities/metrics';
import { Detail } from './internal/repositories/entities/details';

const main = async () => {
  try {
    const configs = initConfigs();

    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = configs.db;
    const ds = new DataSource({
      type: 'postgres',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [Customer, Employee, Order, Supplier, Product, Detail, Metric],
      synchronize: false,
      logging: true,
      extra: {
        decimalNumbers: true,
      },
    });
    await ds.initialize();

    const metricsRepo = new MetricsRepo(ds);
    const customersRepo = new CustomersRepo(ds);
    const employeesRepo = new EmployeesRepo(ds);
    const ordersRepo = new OrdersRepo(ds);
    const productsRepo = new ProductsRepo(ds);
    const suppliersRepo = new SuppliersRepo(ds);

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
