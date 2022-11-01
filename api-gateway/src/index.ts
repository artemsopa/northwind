import { initConfigs } from '@/configs';
import { App } from '@/app';
import { Service } from '@/service';

const main = async () => {
  try {
    const configs = initConfigs();

    const { PORT, DRIZZLE_HOST, TYPEORM_HOST, KNEX_HOST, KYSELY_HOST, PRISMA_HOST, MIKRO_HOST } = configs;

    const app = new App(
      PORT,
      new Service('/drizzle', DRIZZLE_HOST),
      new Service('/typeorm', TYPEORM_HOST),
      new Service('/knex', KNEX_HOST),
      new Service('/kysely', KYSELY_HOST),
      new Service('/prisma', PRISMA_HOST),
      new Service('/mikro', MIKRO_HOST),
    );

    app.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
