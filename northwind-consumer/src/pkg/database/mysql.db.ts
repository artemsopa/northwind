import 'reflect-metadata';
import { DataSource } from 'typeorm';
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
    entities: [Metric],
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
