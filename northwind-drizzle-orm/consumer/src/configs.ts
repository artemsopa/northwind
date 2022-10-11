import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, AWS_SQS_URL,
  } = process.env;

  if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME || !AWS_SQS_URL) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    db: {
      DB_HOST,
      DB_PORT: Number(DB_PORT),
      DB_USER,
      DB_PASSWORD,
      DB_NAME,
    },
    aws: {
      AWS_SQS_URL,
    },
  };
};

export default initConfigs;
