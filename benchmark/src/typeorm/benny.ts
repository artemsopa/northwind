import benny from 'benny';

import { Order } from '@/typeorm/entities/orders';
import { Detail } from '@/typeorm/entities/details';
import { Product } from '@/typeorm/entities/products';
import { Employee } from '@/typeorm/entities/employees';
import { Customer } from '@/typeorm/entities/customers';
import { Supplier } from '@/typeorm/entities/suppliers';

import { getConnection } from '@/typeorm';

export const startTypeOrmSuites = async () => {
  const db = await getConnection();

  await benny.suite(
    'TypeORM',

    benny.add('TypeORM Customers: getAll', async () => {
      await db.getRepository(Customer).createQueryBuilder('customers').getMany();
    }),
    benny.add('TypeORM Customers: getInfo', async () => {
      await db.getRepository(Customer).createQueryBuilder('customers')
        .where('customers.id = :id', { id: 'ALFKI' })
        .getOne();
    }),
    benny.add('TypeORM Customers: search', async () => {
      await db.getRepository(Customer).createQueryBuilder('customers')
        .where('customers.company_name ilike :company', { company: '%ha%' })
        .getMany();
    }),

    benny.add('TypeORM Employees: getAll', async () => {
      await db.getRepository(Employee).createQueryBuilder('employees').getMany();
    }),
    benny.add('TypeORM Employees: getInfo', async () => {
      await db.getRepository(Employee).createQueryBuilder('employees')
        .leftJoinAndSelect(
          'employees.recipient',
          'recipients',
        ).where('employees.id = :id', { id: '1' })
        .getOne();
    }),

    benny.add('TypeORM Suppliers: getAll', async () => {
      await db.getRepository(Supplier).createQueryBuilder('suppliers').getMany();
    }),
    benny.add('TypeORM Suppliers: getInfo', async () => {
      await db.getRepository(Supplier).createQueryBuilder('suppliers')
        .where('suppliers.id = :id', { id: '1' })
        .getOne();
    }),

    benny.add('TypeORM Products: getAll', async () => {
      await db.getRepository(Product).createQueryBuilder('products').getMany();
    }),
    benny.add('TypeORM Products: getInfo', async () => {
      await db.getRepository(Product).createQueryBuilder('products')
        .leftJoinAndSelect(
          'products.supplier',
          'suppliers',
        ).where('products.id = :id', { id: '1' })
        .getOne();
    }),
    benny.add('TypeORM Products: search', async () => {
      await db.getRepository(Product).createQueryBuilder('products')
        .where('products.name ilike :name', { name: '%cha%' })
        .getMany();
    }),

    benny.add('TypeORM Orders: getAll', async () => {
      await db.getRepository(Order)
        .createQueryBuilder('orders')
        .leftJoinAndSelect(
          'orders.details',
          'order_details',
        ).getMany();
    }),
    benny.add('TypeORM Orders: getInfo', async () => {
      await db.getRepository(Detail)
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

    benny.cycle(),
    benny.complete(),
  );
};
