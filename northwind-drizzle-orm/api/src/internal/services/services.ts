import { Queue } from 'src/pkg/queue';
import { CustomersService } from './cutomers.service';
import { EmployeesService } from './employees.service';
import { OrdersService } from './orders.service';
import { SuppliersService } from './suppliers.service';
import { ProductsService } from './products.service';
import { Repositories } from '../repositories/repositories';
import { MetricsService } from './metrics.service';

export interface Services {
  metrics: MetricsService,
  customers: CustomersService,
  employees: EmployeesService,
  suppliers: SuppliersService
  products: ProductsService,
  orders: OrdersService,
}

export const initServices = (repos: Repositories, queue: Queue): Services => ({
  metrics: new MetricsService(repos.metrics),
  customers: new CustomersService(repos.customers, queue),
  employees: new EmployeesService(repos.employees, queue),
  suppliers: new SuppliersService(repos.suppliers, queue),
  products: new ProductsService(repos.products, queue),
  orders: new OrdersService(repos.orders, queue),
});
