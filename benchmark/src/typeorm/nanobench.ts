import bench from 'nanobench';

import { Customer } from '@/typeorm/entities/customers';
import { Employee } from '@/typeorm/entities/employees';
import { Supplier } from '@/typeorm/entities/suppliers';
import { Product } from '@/typeorm/entities/products';
import { Order } from '@/typeorm/entities/orders';
import { Detail } from '@/typeorm/entities/details';

import { getConnection } from '@/typeorm';

export const startTypeOrmBenches = async () => {
  const db = await getConnection();

  const count = new Array(1000);

  await bench('TypeORM Customers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      db.getRepository(Customer).createQueryBuilder('customers').getMany();
    }
    b.end();
  });
  await bench('TypeORM Customers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Customer).createQueryBuilder('customers')
        .where('customers.id = :id', { id: 'ALFKI' })
        .getOne();
    }
    b.end();
  });
  await bench('TypeORM Customers: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Customer).createQueryBuilder('customers')
        .where('customers.company_name ilike :company', { company: '%ha%' })
        .getMany();
    }
    b.end();
  });

  await bench('TypeORM Employees: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Employee).createQueryBuilder('employees').getMany();
    }
    b.end();
  });
  await bench('TypeORM Employees: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Employee).createQueryBuilder('employees')
        .leftJoinAndSelect(
          'employees.recipient',
          'recipients',
        ).where('employees.id = :id', { id: '1' })
        .getOne();
    }
    b.end();
  });

  await bench('TypeORM Suppliers: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Supplier).createQueryBuilder('suppliers').getMany();
    }
    b.end();
  });
  await bench('TypeORM Suppliers: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Supplier).createQueryBuilder('suppliers')
        .where('suppliers.id = :id', { id: '1' })
        .getOne();
    }
    b.end();
  });

  await bench('TypeORM Products: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Product).createQueryBuilder('products').getMany();
    }
    b.end();
  });
  await bench('TypeORM Products: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Product).createQueryBuilder('products')
        .leftJoinAndSelect(
          'products.supplier',
          'suppliers',
        ).where('products.id = :id', { id: '1' })
        .getOne();
    }
    b.end();
  });
  await bench('TypeORM Products: search', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Product).createQueryBuilder('products')
        .where('products.name ilike :name', { name: '%cha%' })
        .getMany();
    }
    b.end();
  });

  await bench('TypeORM Orders: getAll', async (b) => {
    b.start();
    for await (const i of count) {
      await db.getRepository(Order)
        .createQueryBuilder('orders')
        .leftJoinAndSelect(
          'orders.details',
          'order_details',
        ).getMany();
    }
    b.end();
  });
  await bench('TypeORM Orders: getInfo', async (b) => {
    b.start();
    for await (const i of count) {
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
    }
    b.end();
  });
};
