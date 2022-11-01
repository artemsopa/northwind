import { startDrizzleOrmBenches } from '@/drizzle-orm/mitata';
import { startKnexOrmBenches } from '@/knex-orm/mitata';
import { startKyselyOrmBenches } from '@/kysely-orm/mitata';
import { startPgDriverBenches } from '@/pg/mitata';
import { startPrismaOrmBenches } from '@/prisma-orm/mitata';
import { startTypeOrmBenches } from '@/typeorm/mitata';

const main = async () => {
  try {
    await startPgDriverBenches();
    await startDrizzleOrmBenches();
    await startKnexOrmBenches();
    await startKyselyOrmBenches();
    await startPrismaOrmBenches();
    // await startTypeOrmBenches();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
