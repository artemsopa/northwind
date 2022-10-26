import { PgConnector } from 'drizzle-orm-pg';
import { connect } from 'drizzle-orm';
import { Pool } from 'pg';
import { initConfigs } from '@/configs';
import { schema } from '@/drizzle-orm/data/schema';

export const getConnection = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = initConfigs();
  const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });
  const connector = new PgConnector(pool, schema);
  const db = await connect(connector);

  return db;
};
