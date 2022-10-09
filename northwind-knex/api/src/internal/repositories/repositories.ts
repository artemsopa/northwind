import { Knex } from 'knex';
import { Customer } from './types/customer';
import { Employee, EmployeeWithRecipient } from './types/employee';
import { Order, OrderWithDetail, OrderWithDetailAndProduct } from './types/order';
import { Detail } from './types/detail';
import { Product, ProductWithSupplier } from './types/product';
import { Supplier } from './types/supplier';
import CustomersRepo from './customers.repo';
import EmployeesRepo from './employees.repo';
import OrdersRepo from './orders.repo';
import DetailsRepo from './details.repo';
import ProductsRepo from './products.repo';
import SuppliersRepo from './suppliers.repo';
import { Metric, QueryTypes } from './types/metric';
import MetricsRepo from './metrics.repo';

export interface ICustomersRepo {
  getAll(): Promise<ItemsWithMetric<Customer[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Customer | undefined>>;
  search(company: string): Promise<ItemsWithMetric<Customer[]>>;
  createMany(customers: Customer[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IEmployeesRepo {
  getAll():Promise<ItemsWithMetric<Employee[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<EmployeeWithRecipient | undefined>>;
  createMany(employees: Employee[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IOrdersRepo {
  getAll():Promise<ItemsWithMetric<OrderWithDetail[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<OrderWithDetailAndProduct[]>>;
  createMany(orders: Order[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IDetailsRepo {
  createMany(details: Detail[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IProductsRepo {
  getAll():Promise<ItemsWithMetric<Product[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<ProductWithSupplier | undefined>>;
  search(name: string): Promise<ItemsWithMetric<Product[]>>;
  createMany(products: Product[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface ISuppliersRepo {
  getAll():Promise<ItemsWithMetric<Supplier[]>>;
  getInfo(id: string): Promise<ItemsWithMetric<Supplier | undefined>>;
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
  constructor(knex: Knex) {
    this.metrics = new MetricsRepo(knex);
    this.customers = new CustomersRepo(knex);
    this.employees = new EmployeesRepo(knex);
    this.orders = new OrdersRepo(knex);
    this.details = new DetailsRepo(knex);
    this.products = new ProductsRepo(knex);
    this.suppliers = new SuppliersRepo(knex);
  }
}
