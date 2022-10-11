import { CustomersRepo } from './customers';
import { EmployeesRepo } from './employees';
import { OrdersRepo } from './orders';
import { DetailsRepo } from './details';
import { ProductsRepo } from './products';
import { SuppliersRepo } from './suppliers';
import { MetricsRepo } from './metrics';
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
