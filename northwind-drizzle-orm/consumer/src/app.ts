import { SQS } from 'aws-sdk';
import { connect } from 'drizzle-orm';
import { PgConnector } from 'drizzle-orm-pg';
import { Pool } from 'pg';
import { Consumer } from 'src/consumer';
import { schema } from 'src/schema';
import initConfigs from './configs';
import { Queue } from './queue';

const createApp = async () => {
  try {
    const configs = initConfigs();

    const {
      DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,
    } = configs.db;

    const pool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    const connector = new PgConnector(pool, schema);
    const db = await connect(connector);
    console.log('Database connection successful...');

    const { AWS_SQS_URL } = configs.aws;
    const queue = new Queue(new SQS({}), AWS_SQS_URL);
    const consumer = new Consumer(db, queue);

    return consumer;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default createApp();
