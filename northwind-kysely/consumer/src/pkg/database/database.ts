import knex from 'knex';

const initDbConnection = async (
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
  directory: string,
) => {
  const db = knex({
    client: 'pg',
    connection: {
      host,
      port,
      user,
      password,
      database,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'migrations',
      directory,
    },
    useNullAsDefault: true,
  });
  console.log('Database connection successful...');
  return db;
};

export default initDbConnection;
