import { PrismaClient } from '@prisma/client';
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

const main = async () => {
  try {
    const configs = initConfigs();

    const prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    const metricsRepo = new MetricsRepo(prisma);
    const customersRepo = new CustomersRepo(prisma);
    const employeesRepo = new EmployeesRepo(prisma);
    const ordersRepo = new OrdersRepo(prisma);
    const productsRepo = new ProductsRepo(prisma);
    const suppliersRepo = new SuppliersRepo(prisma);

    const metricsService = new MetricsService(metricsRepo);
    const customersService = new CustomersService(customersRepo);
    const employeesService = new EmployeesService(employeesRepo);
    const suppliersService = new SuppliersService(suppliersRepo);
    const productsService = new ProductsService(productsRepo);
    const ordersService = new OrdersService(ordersRepo);

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
