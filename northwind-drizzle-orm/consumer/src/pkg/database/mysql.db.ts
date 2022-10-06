import { connect } from 'drizzle-orm';
import { PgConnector } from 'drizzle-orm-pg';
import { Pool } from 'pg';
import { schema } from '../../internal/repositories/entities/schema';

const initDbConnection = async (
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
) => {
  const pool = new Pool({
    host,
    port,
    user,
    password,
    database,
  });
  const connector = new PgConnector(pool, schema);
  const db = await connect(connector);
  console.log('Database connection successful...');
  return db;
};

export default initDbConnection;
