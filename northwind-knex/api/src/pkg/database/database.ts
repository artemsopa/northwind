import knex from 'knex';
import pg from 'pg';

const initDbConnection = async (
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
  directory: string,
) => {
  pg.types.setTypeParser(1700, 'text', parseFloat);
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
  // await dropTables(db);
  // await createTables(db);
  await db.migrate.latest();
  console.log('Database connection successful...');
  return db;
};

export default initDbConnection;
