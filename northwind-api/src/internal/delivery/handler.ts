import cors from 'cors';
import express, { Router } from 'express';
import Services from '../services/services';
import errorMiddleware from './middlewares/error.mware';
import notfMiddleware from './middlewares/notf.mware';
import AdminRoute from './routes/admin.route';
import CustomersRoute from './routes/customers.routes';
import EmployeesRoute from './routes/employees.route';
import OrdersRoute from './routes/orders.route';
import ProductsRoute from './routes/products.route';
import SuppliersRoute from './routes/suppliers.route';

class Handler {
  constructor(private services: Services) {
    this.services = services;
  }

  initHandler() {
    return express()
      .use(cors())
      .use(express.json())
      .use(this.initRoutes())
      .use(errorMiddleware)
      .use(notfMiddleware);
  }

  private initRoutes() {
    return Router()
      .use('/admin', new AdminRoute(this.services.admin).initRoutes())
      .use('/customers', new CustomersRoute(this.services.customers).initRoutes())
      .use('/employees', new EmployeesRoute(this.services.employees).initRoutes())
      .use('/suppliers', new SuppliersRoute(this.services.suppliers).initRoutes())
      .use('/products', new ProductsRoute(this.services.products).initRoutes())
      .use('/orders', new OrdersRoute(this.services.orders).initRoutes());
  }
}

export default Handler;
