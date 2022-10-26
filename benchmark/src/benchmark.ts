import { startPgDriverSuite } from '@/pg/benchmark';

const main = async () => {
  try {
    await startPgDriverSuite();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
