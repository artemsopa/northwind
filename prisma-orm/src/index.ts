import { PrismaClient } from '@prisma/client';
import { initConfigs } from '@/configs';
import { CustomersController } from '@/controllers/customers';
import { EmployeesController } from '@/controllers/employees';
import { SuppliersController } from '@/controllers/suppliers';
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

    const prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    const metricsService = new MetricsService(prisma);
    const customersService = new CustomersService(prisma);
    const employeesService = new EmployeesService(prisma);
    const suppliersService = new SuppliersService(prisma);
    const productsService = new ProductsService(prisma);
    const ordersService = new OrdersService(prisma);

    const { PORT } = configs;
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
