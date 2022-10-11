import { Queue } from '../../pkg/queue';
import { CustomersService } from './cutomers';
import { EmployeesService } from './employees';
import { OrdersService } from './orders';
import { SuppliersService } from './suppliers';
import { ProductsService } from './products';
import { Repositories } from '../repositories/repositories';
import { MetricsService } from './metrics';

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
