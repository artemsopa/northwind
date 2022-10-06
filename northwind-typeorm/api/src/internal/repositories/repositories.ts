import { DataSource } from 'typeorm';
import Customer from './entities/customer';
import Employee from './entities/employee';
import Order from './entities/order';
import Detail from './entities/detail';
import Product from './entities/product';
import Supplier from './entities/supplier';
import CustomersRepo from './customers.repo';
import EmployeesRepo from './employees.repo';
import OrdersRepo from './orders.repo';
import DetailsRepo from './details.repo';
import ProductsRepo from './products.repo';
import SuppliersRepo from './suppliers.repo';
import Metric, { QueryTypes } from './entities/metric';
import MetricsRepo from './metrics.repo';

export interface ICustomersRepo {
  getAll(): Promise<ItemsWithMetric<Customer[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Customer | null>>;
  search(company: string): Promise<ItemsWithMetric<Customer[]>>;
  createMany(customers: Customer[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IEmployeesRepo {
  getAll():Promise<ItemsWithMetric<Employee[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Employee | null>>;
  createMany(employees: Employee[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IOrdersRepo {
  getAll():Promise<ItemsWithMetric<Order[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Detail[]>>;
  createMany(orders: Order[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IDetailsRepo {
  createMany(details: Detail[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IProductsRepo {
  getAll():Promise<ItemsWithMetric<Product[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Product | null>>;
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
  constructor(ds: DataSource) {
    this.metrics = new MetricsRepo(ds);
    this.customers = new CustomersRepo(ds);
    this.employees = new EmployeesRepo(ds);
    this.orders = new OrdersRepo(ds);
    this.details = new DetailsRepo(ds);
    this.products = new ProductsRepo(ds);
    this.suppliers = new SuppliersRepo(ds);
  }
}
