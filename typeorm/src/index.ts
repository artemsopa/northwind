import 'reflect-metadata';
import { DataSource } from 'typeorm';
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
import { Customer } from '@/entities/customers';
import { Employee } from '@/entities/employees';
import { Order } from '@/entities/orders';
import { Supplier } from '@/entities/suppliers';
import { Product } from '@/entities/products';
import { Metric } from '@/entities/metrics';
import { Detail } from '@/entities/details';

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

    const customersService = new CustomersService(ds);
    const employeesService = new EmployeesService(ds);
    const suppliersService = new SuppliersService(ds);
    const productsService = new ProductsService(ds);
    const ordersService = new OrdersService(ds);

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
