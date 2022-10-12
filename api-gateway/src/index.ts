import { initConfigs } from '@/configs/configs';
import { App } from '@/internal/app';
import { Service } from './internal/service';

const main = async () => {
  try {
    const configs = initConfigs();

    const { PORT, DRIZZLE_HOST } = configs;

    const app = new App(
      PORT,
      new Service('/drizzle', DRIZZLE_HOST),
    );

    app.start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
