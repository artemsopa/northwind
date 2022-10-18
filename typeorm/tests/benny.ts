import 'reflect-metadata';
import b from 'benny';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Employee } from '@/entities/employees';
import { Detail } from '@/entities/details';
import { Order } from '@/entities/orders';
import { Customer } from '@/entities/customers';
import { Supplier } from '@/entities/suppliers';
import { Product } from '@/entities/products';

dotenv.config();

const main = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Invalid environment variables!');
  }

  const ds = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [Customer, Employee, Order, Supplier, Product, Detail],
    synchronize: false,
    logging: true,
    extra: {
      decimalNumbers: true,
    },
  });

  await ds.initialize();

  b.suite(
    'Benny tests',

    b.add('Select employee with recipient by id', async () => {
      await ds.getRepository(Employee).createQueryBuilder('employees')
        .leftJoinAndSelect(
          'employees.recipient',
          'recipients',
        ).where('employees.id = :id', { id: '1' })
        .getOne();
    }),

    b.add('Select order_details with orders and products', async () => {
      await ds.getRepository(Detail)
        .createQueryBuilder('order_details')
        .leftJoinAndSelect(
          'order_details.order',
          'orders',
        ).leftJoinAndSelect(
          'order_details.product',
          'products',
        )
        .where('order_details.order_id = :id', { id: '10248' })
        .getMany();
    }),

    b.cycle(),
    b.complete(),
    b.save({ file: 'reduce', version: '1.0.0' }),
    b.save({ file: 'reduce', format: 'chart.html' }),
  );
};

main();
