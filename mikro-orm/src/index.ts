import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
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
import { Product } from '@/entities/products';
import { Supplier } from '@/entities/suppliers';
import { Detail } from '@/entities/details';

const main = async () => {
  try {
    const configs = initConfigs();

    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = configs.db;
    const orm = await MikroORM.init<PostgreSqlDriver>({
      type: 'postgresql',
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      dbName: DB_NAME,
      entities: [Customer, Employee, Order, Supplier, Product, Detail],
      metadataProvider: TsMorphMetadataProvider,
    });
    const em = orm.em.fork();

    const customersService = new CustomersService(em);
    const employeesService = new EmployeesService(em);
    const suppliersService = new SuppliersService(em);
    const productsService = new ProductsService(em);
    const ordersService = new OrdersService(em);

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
