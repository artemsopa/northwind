import dotenv from 'dotenv';

export const initConfigs = () => {
  dotenv.config();
  const {
    PORT,
    DRIZZLE_HOST,
    TYPEORM_HOST,
    KNEX_HOST,
    KYSELY_HOST,
    PRISMA_HOST,
  } = process.env;

  if (!PORT
    || !DRIZZLE_HOST
    || !TYPEORM_HOST
    || !KNEX_HOST
    || !KYSELY_HOST
    || !PRISMA_HOST
  ) {
    throw new Error('ERROR! One of the ports cannot be found.');
  }

  return {
    PORT: Number(PORT),
    DRIZZLE_HOST,
    TYPEORM_HOST,
    KNEX_HOST,
    KYSELY_HOST,
    PRISMA_HOST,
  };
};
