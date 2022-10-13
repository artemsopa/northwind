import { initConfigs } from '@/configs/configs';
import { App } from '@/internal/app';
import { Service } from './internal/service';

const main = async () => {
  try {
    const configs = initConfigs();

    const { PORT, DRIZZLE_HOST, TYPEORM_HOST, KNEX_HOST, KYSELY_HOST, PRISMA_HOST } = configs;

    const app = new App(
      PORT,
      new Service('/drizzle', DRIZZLE_HOST),
      new Service('/typeorm', TYPEORM_HOST),
      new Service('/knex', KNEX_HOST),
      new Service('/kysely', KYSELY_HOST),
      new Service('/prisma', PRISMA_HOST),
    );

    app.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
