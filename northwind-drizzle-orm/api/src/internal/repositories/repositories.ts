import { CustomersRepo } from './customers.repo';
import { EmployeesRepo } from './employees.repo';
import { OrdersRepo } from './orders.repo';
import { DetailsRepo } from './details.repo';
import { ProductsRepo } from './products.repo';
import { SuppliersRepo } from './suppliers.repo';
import { MetricsRepo } from './metrics.repo';
import { Database } from './entities/schema';

export interface Repositories {
  metrics: MetricsRepo,
  customers: CustomersRepo,
  employees: EmployeesRepo,
  orders: OrdersRepo,
  details: DetailsRepo,
  products: ProductsRepo,
  suppliers: SuppliersRepo,
}

export const initRepositories = (db: Database): Repositories => ({
  metrics: new MetricsRepo(db),
  customers: new CustomersRepo(db),
  employees: new EmployeesRepo(db),
  orders: new OrdersRepo(db),
  details: new DetailsRepo(db),
  products: new ProductsRepo(db),
  suppliers: new SuppliersRepo(db),
});
