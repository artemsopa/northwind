import 'reflect-metadata';
import { DataSource } from 'typeorm';
import Customer from '../../internal/repositories/entities/customer';
import Employee from '../../internal/repositories/entities/employee';
import Order from '../../internal/repositories/entities/order';
import Supplier from '../../internal/repositories/entities/supplier';
import Product from '../../internal/repositories/entities/product';
import Detail from '../../internal/repositories/entities/detail';
import Metric from '../../internal/repositories/entities/metric';

const initDbConnection = async (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
) => {
  const ds = new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [Customer, Employee, Order, Supplier, Product, Detail, Metric],
    synchronize: false,
    logging: true,
    extra: {
      decimalNumbers: true,
    },
  });
  await ds.initialize();
  console.log('Database connection successful...');
  return ds;
};

export default initDbConnection;
