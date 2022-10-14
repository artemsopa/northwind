import dotenv from 'dotenv';

export const initConfigs = () => {
  dotenv.config();
  const {
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  if (!PORT
    || !DB_HOST
    || !DB_PORT
    || !DB_USER
    || !DB_PASSWORD
    || !DB_NAME) {
    throw new Error('ERROR! Invalid configuration...');
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
    },
  };
};
