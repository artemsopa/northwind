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
  migrationsFolder: string,
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
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, migrationsFolder),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration "${it.migrationName}" was executed successfully!`);
    } else if (it.status === 'Error') {
      console.error(`Failed to execute migration "${it.migrationName}!"`);
    }
  });

  if (error) {
    console.error('Failed to migrate...');
    console.error(error);
  }

  console.log('Database connection successful...');
  return db;
};

export default initDbConnection;
