import { startDrizzleOrmSuites } from '@/drizzle-orm/benny';
import { startKnexOrmSuites } from '@/knex-orm/benny';
import { startKyselyOrmSuites } from '@/kysely-orm/benny';
import { startPgDriverSuites } from '@/pg/benny';
import { startPrismaOrmSuites } from '@/prisma-orm/benny';
import { startTypeOrmSuites } from '@/type-orm/benny';

const main = async () => {
  try {
    // await startPgDriverSuites();
    // await startDrizzleOrmSuites();
    // await startKnexOrmSuites();
    // await startKyselyOrmSuites();
    // await startPrismaOrmSuites();
    await startTypeOrmSuites();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
