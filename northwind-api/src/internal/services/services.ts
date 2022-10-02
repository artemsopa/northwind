import { ICSVReader } from '../../pkg/reader/reader';
import Repositories from '../repositories/repositories';
import AdminService from './admin.service';
import { CustomerInfo, CustomerItem } from './dtos/customer';
import { EmployeeItem, EmployeeInfo } from './dtos/employee';
import { SupplierInfo, SupplierItem } from './dtos/supplier';
import CustomersService from './cutomers.service';
import EmployeesService from './employees.service';
import { ProductItem, ProductInfo } from './dtos/product';
import { OrderItem, OrderInfo } from './dtos/order';
import OrdersService from './orders.service';
import SuppliersService from './suppliers.service';
import ProductsService from './products.service';
import { MetricsInfo, EnqueuedMetric } from './dtos/metric';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';

export interface IAdminService {
  rewriteData(): Promise<void>;
  getAllMetrics(): Promise<MetricsInfo>;
}

export interface ICustomersService {
  getAll(): Promise<CustomerItem[]>;
  getInfo(id: string): Promise<CustomerInfo>;
  search(company: string): Promise<CustomerItem[]>;
}

export interface IEmployeesService {
  getAll(): Promise<EmployeeItem[]>;
  getInfo(id: string): Promise<EmployeeInfo>;
}

export interface ISuppliersService {
  getAll(): Promise<SupplierItem[]>;
  getInfo(id: string): Promise<SupplierInfo>;
}

export interface IProductsService {
  getAll(): Promise<ProductItem[]>;
  getInfo(id: string): Promise<ProductInfo>;
  search(name: string): Promise<ProductItem[]>;
}

export interface IOrdersService {
  getAll(): Promise<OrderItem[]>;
  getInfo(id: string): Promise<OrderInfo>;
}

export class Deps {
  reader: ICSVReader;
  queue: ISQSQueue;
  repos: Repositories;
  constructor(reader: ICSVReader, repos: Repositories, queue: ISQSQueue) {
    this.reader = reader;
    this.queue = queue;
    this.repos = repos;
  }
}

export default class Services {
  admin: IAdminService;
  customers: ICustomersService;
  employees: IEmployeesService;
  suppliers: ISuppliersService;
  products: IProductsService;
  orders: IOrdersService;
  constructor(deps: Deps) {
    this.admin = new AdminService(deps.reader, deps.repos);
    this.customers = new CustomersService(deps.repos.customers, deps.queue);
    this.employees = new EmployeesService(deps.repos.employees, deps.queue);
    this.suppliers = new SuppliersService(deps.repos.suppliers, deps.queue);
    this.products = new ProductsService(deps.repos.products, deps.queue);
    this.orders = new OrdersService(deps.repos.orders, deps.repos.products, deps.queue);
  }
}
