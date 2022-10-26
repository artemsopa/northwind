import { startKnexOrmSuite } from '@/knex-orm/benchmark';
import { startTypeOrmSuite } from '@/typeorm/benchmark';
import { startDrizzleOrmSuite } from './drizzle-orm/benchmark';
import { startKyselyOrmSuite } from './kysely-orm/benchmark';
import { startPgDriverSuite } from './pg/benchmark';
import { startPrismaOrmSuite } from './prisma-orm/benchmark';

const main = async () => {
  try {
    await startPgDriverSuite();
    // await startDrizzleOrmSuite();
    // await startKnexOrmSuite();
    // await startKyselyOrmSuite();
    // await startPrismaOrmSuite();
    // await startTypeOrmSuite();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
