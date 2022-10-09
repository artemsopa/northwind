import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const envs = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  NAME: process.env.DB_NAME,
  DIR: process.env.MIGRATION_DIR,
};

if (!envs.HOST || !envs.PORT || !envs.USER || !envs.PASSWORD || !envs.NAME || !envs.DIR) {
  throw new Error('Empty env vars!');
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: envs.HOST,
      port: Number(envs.PORT),
      user: envs.USER,
      password: envs.PASSWORD,
      database: envs.NAME,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'migrations',
      directory: path.join(__dirname, envs.DIR),
    },
    useNullAsDefault: true,
  },
};

module.exports = config;
