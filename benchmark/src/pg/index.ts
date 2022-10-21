import { Pool } from 'pg';
import { initConfigs } from '../configs';

export const getConnectionPgDriver = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = initConfigs();
  const db = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  return db;
};
