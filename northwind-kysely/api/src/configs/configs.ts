import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    CSV_DIR,
    MIGRATION_DIR,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    AWS_SQS_URL,
  } = process.env;

  if (!PORT
    || !DB_HOST
    || !DB_PORT
    || !DB_USER
    || !DB_PASSWORD
    || !DB_NAME
    || !CSV_DIR
    || !MIGRATION_DIR
    || !AWS_ACCESS_KEY
    || !AWS_SECRET_KEY
    || !AWS_REGION
    || !AWS_SQS_URL) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    app: {
      PORT: Number(PORT),
    },
    db: {
      DB_HOST,
      DB_PORT: Number(DB_PORT),
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
      MIGRATION_DIR,
    },
    csv: {
      CSV_DIR,
    },
    aws: {
      AWS_ACCESS_KEY,
      AWS_SECRET_KEY,
      AWS_REGION,
      sqs: {
        AWS_SQS_URL,
      },
    },
  };
};

export default initConfigs;