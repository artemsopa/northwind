import { startDrizzleOrmBenches } from '@/drizzle-orm/nanobench';
import { startKnexOrmBenches } from '@/knex-orm/nanobench';
import { startKyselyOrmBenches } from '@/kysely-orm/nanobench';
import { startPgDriverBenches } from '@/pg/nanobench';
import { startPrismaOrmBenches } from '@/prisma-orm/nanobench';
import { startTypeOrmBenches } from '@/type-orm/nanobench';

const main = async () => {
  try {
    await startPgDriverBenches();
    await startDrizzleOrmBenches();
    await startKnexOrmBenches();
    await startKyselyOrmBenches();
    await startPrismaOrmBenches();
    await startTypeOrmBenches();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
