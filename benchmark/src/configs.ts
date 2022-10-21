import dotenv from 'dotenv';

export const initConfigs = () => {
  dotenv.config();
  const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  if (!DB_HOST
    || !DB_PORT
    || !DB_USER
    || !DB_PASSWORD
    || !DB_NAME) {
    throw new Error(`${DB_HOST}`);
  }

  return {
    DB_HOST,
    DB_PORT: Number(DB_PORT),
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  };
};
