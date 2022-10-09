import CustomersRepo from './customers.repo';
import EmployeesRepo from './employees.repo';
import OrdersRepo from './orders.repo';
import DetailsRepo from './details.repo';
import ProductsRepo from './products.repo';
import SuppliersRepo from './suppliers.repo';
import MetricsRepo from './metrics.repo';
import { Customer } from './entities/customers';
import { Metric } from './entities/metrics';
import { Employee } from './entities/employees';
import { Order } from './entities/orders';
import { Detail } from './entities/details';
import { Product } from './entities/products';
import { Supplier } from './entities/suppliers';
import { DataBase } from './entities/schema';

export interface ICustomersRepo {
  getAll(): Promise<ItemsWithMetric<Customer[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Customer | null>>;
  search(company: string): Promise<ItemsWithMetric<Customer[]>>;
  createMany(customers: Customer[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IEmployeesRepo {
  getAll():Promise<ItemsWithMetric<Employee[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<any | null>>;
  createMany(employees: Employee[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IOrdersRepo {
  getAll(): Promise<ItemsWithMetric<{ orders: Order, details: Detail | null }[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<{ orders: Order | null, products: Product | null, details: Detail }[] | null>>;
  createMany(orders: Order[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IDetailsRepo {
  createMany(details: Detail[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IProductsRepo {
  getAll(): Promise<ItemsWithMetric<Product[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<{ suppliers: Supplier | null, products: Product } | null>>;
  search(name: string): Promise<ItemsWithMetric<Product[]>>;
  createMany(products: Product[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface ISuppliersRepo {
  getAll():Promise<ItemsWithMetric<Supplier[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Supplier | null>>;
  createMany(suppliers: Supplier[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IMetricsRepo {
  getAll(): Promise<Metric[]>;
}

export enum QueryTypes {
  SELECT = 'SELECT',
  SELECT_WHERE = 'SELECT_WHERE',
  SELECT_LEFT_JOIN = 'SELECT_LEFT_JOIN',
  SELECT_LEFT_JOIN_WHERE = 'SELECT_LEFT_JOIN_WHERE'
}

export class ItemsWithMetric<T> {
  data: T;
  query: string;
  type: QueryTypes;
  constructor(
    data: T,
    query: string,
    type: QueryTypes,
  ) {
    this.data = data;
    this.query = query;
    this.type = type;
  }
}

export default class Repositories {
  metrics: IMetricsRepo;
  customers: ICustomersRepo;
  employees: IEmployeesRepo;
  orders: IOrdersRepo;
  details: IDetailsRepo;
  products: IProductsRepo;
  suppliers: ISuppliersRepo;
  constructor(readonly db: DataBase) {
    this.metrics = new MetricsRepo(db);
    this.customers = new CustomersRepo(db);
    this.employees = new EmployeesRepo(db);
    this.orders = new OrdersRepo(db);
    this.details = new DetailsRepo(db);
    this.products = new ProductsRepo(db);
    this.suppliers = new SuppliersRepo(db);
  }
}
