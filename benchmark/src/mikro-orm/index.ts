import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { initConfigs } from '@/configs';
import { Customer } from '@/mikro-orm/entities/customers';
import { Employee } from '@/mikro-orm/entities/employees';
import { Order } from '@/mikro-orm/entities/orders';
import { Supplier } from '@/mikro-orm/entities/suppliers';
import { Product } from '@/mikro-orm/entities/products';
import { Detail } from '@/mikro-orm/entities/details';

export const getConnection = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = initConfigs();
  const orm = await MikroORM.init<PostgreSqlDriver>({
    type: 'postgresql',
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    dbName: DB_NAME,
    entities: [Customer, Employee, Order, Supplier, Product, Detail],
    metadataProvider: TsMorphMetadataProvider,
  });
  const em = orm.em.fork();
  return em;
};
