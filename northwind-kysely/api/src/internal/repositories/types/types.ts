import { Customer } from './customer';
import { Detail } from './detail';
import { Employee } from './employee';
import { Metric } from './metric';
import { Order } from './order';
import { Product } from './product';
import { Supplier } from './supplier';

export default interface Database {
    customers: Customer;
    employees: Employee;
    orders: Order;
    products: Product;
    suppliers: Supplier;
    details: Detail;
    metrics: Metric;
}
