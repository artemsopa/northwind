import {
  Customer, Employee, Metric, Order, PrismaClient, Product, Supplier,
} from '@prisma/client';
import CustomersRepo from './customers.repo';
import EmployeesRepo from './employees.repo';
import OrdersRepo from './orders.repo';
import DetailsRepo from './details.repo';
import ProductsRepo from './products.repo';
import SuppliersRepo from './suppliers.repo';
import MetricsRepo from './metrics.repo';
import { DetailInput } from './types/details';
import { EmployeeJoinRecipient } from './types/employees';
import { DetailJoinProductJoinOrder, OrderJoinDetail } from './types/orders';
import { ProductJoinSupplier } from './types/product';

export interface ICustomersRepo {
  getAll(): Promise<Customer[]>;
  getInfo(id: string): Promise<Customer | null>;
  search(company: string): Promise<Customer[]>;
  createMany(customers: Customer[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IEmployeesRepo {
  getAll(): Promise<Employee[]>;
  getInfo(id: string): Promise<EmployeeJoinRecipient | null>;
  createMany(employees: Employee[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IOrdersRepo {
  getAll(): Promise<OrderJoinDetail[]>;
  getInfo(id: string): Promise<DetailJoinProductJoinOrder[]>;
  createMany(orders: Order[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IDetailsRepo {
  createMany(details: DetailInput[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IProductsRepo {
  getAll(): Promise<Product[]>;
  getInfo(id: string): Promise<ProductJoinSupplier | null>;
  search(name: string): Promise<Product[]>;
  createMany(products: Product[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface ISuppliersRepo {
  getAll(): Promise<Supplier[]>;
  getInfo(id: string): Promise<Supplier | null>;
  createMany(suppliers: Supplier[]): Promise<void>;
  deleteAll(): Promise<void>;
}

export interface IMetricsRepo {
  getAll(): Promise<Metric[]>;
}

export default class Repositories {
  metrics: IMetricsRepo;
  customers: ICustomersRepo;
  employees: IEmployeesRepo;
  orders: IOrdersRepo;
  details: IDetailsRepo;
  products: IProductsRepo;
  suppliers: ISuppliersRepo;
  constructor(prisma: PrismaClient) {
    this.metrics = new MetricsRepo(prisma);
    this.customers = new CustomersRepo(prisma);
    this.employees = new EmployeesRepo(prisma);
    this.orders = new OrdersRepo(prisma);
    this.details = new DetailsRepo(prisma);
    this.products = new ProductsRepo(prisma);
    this.suppliers = new SuppliersRepo(prisma);
  }
}
