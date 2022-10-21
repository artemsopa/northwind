import { Pool } from 'pg';
import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from 'kysely';
import { initConfigs } from '../configs';
import { Database } from './dtos';

export const getConnectionKysely = async () => {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = initConfigs()
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
      }),
    }),
  });
  return db;
};
