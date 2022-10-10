import {
  FileMigrationProvider, Kysely, Migrator, PostgresDialect,
} from 'kysely';
import { Pool } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import Database from '../../internal/repositories/types/types';

const initDbConnection = async (
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
) => {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host,
        port,
        user,
        password,
        database,
      }),
    }),
  });

  console.log('Database connection successful...');
  return db;
};

export default initDbConnection;
