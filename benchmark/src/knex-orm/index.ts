import knex from 'knex';
import { initConfigs } from '../configs';

export const getConnectionKnex = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = initConfigs();
  const db = knex({
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    },
    pool: {
      min: 1,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: 'migrations',
    },
    useNullAsDefault: true,
  });

  return db;
};
