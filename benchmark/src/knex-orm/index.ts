import knex from 'knex';
import { initConfigs } from '../configs';

export const getConnection = async () => {
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
    useNullAsDefault: true,
  });

  return db;
};
