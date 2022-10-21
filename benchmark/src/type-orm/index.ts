import { DataSource, Repository } from 'typeorm';
import { initConfigs } from '../configs';
import { Customer } from './entities/customers';
import { Detail } from './entities/details';
import { Employee } from './entities/employees';
import { Order } from './entities/orders';
import { Product } from './entities/products';
import { Supplier } from './entities/suppliers';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = initConfigs();

export const getConnectionTypeOrm = async () => {
  const ds = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [Customer, Employee, Order, Supplier, Product, Detail],
    synchronize: false,
    logging: false,
    extra: {
      decimalNumbers: true,
    },
  });
  await ds.initialize();
  return ds.getRepository(Product);
};