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
  getAll(): Promise<{ customers: Customer[], query: string, type: QueryTypes }>;
  getInfo(id: string): Promise<{ customer: Customer | null, query: string, type: QueryTypes }>;
  search(company: string): Promise<{ customers: Customer[], query: string, type: QueryTypes }>;
  createMany(customers: Customer[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IEmployeesRepo {
  getAll():Promise<{ employees: Employee[], query: string, type: QueryTypes }>;
  getInfo(id: string): Promise<{ employee: Employee | null, query: string, type: QueryTypes }>;
  createMany(employees: Employee[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IOrdersRepo {
  getAll():Promise<{ orders: Order[], query: string, type: QueryTypes }>;
  getInfo(id: string): Promise<{ order: Order | null, query: string, type: QueryTypes }>;
  createMany(orders: Order[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IDetailsRepo {
  createMany(details: Detail[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IProductsRepo {
  getAll():Promise<{ products: Product[], query: string, type: QueryTypes }>;
  getInfo(id: string): Promise<{ product: Product | null, query: string, type: QueryTypes }>;
  getById(id: string): Promise<Product | null>;
  search(name: string): Promise<{ products: Product[], query: string, type: QueryTypes }>;
  createMany(products: Product[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface ISuppliersRepo {
  getAll():Promise<{ suppliers: Supplier[], query: string, type: QueryTypes }>;
  getInfo(id: string): Promise<{ supplier: Supplier | null, query: string, type: QueryTypes }>;
  createMany(suppliers: Supplier[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IMetricsRepo {
  getAll(): Promise<Metric[]>;
  create(query: string, ms: number, type: QueryTypes): Promise<void>;
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
