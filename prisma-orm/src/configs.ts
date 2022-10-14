import dotenv from 'dotenv';

export const initConfigs = () => {
  dotenv.config();
  const {
    PORT,
  } = process.env;

  if (!PORT) {
    throw new Error('ERROR! Invalid configuration...');
  }

  return {
    PORT: Number(PORT),
  };
};
