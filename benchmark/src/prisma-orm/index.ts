import { PrismaClient } from '@prisma/client';

export const getConnectionPrismaOrm = async () => {
  const prisma = new PrismaClient();
  return prisma;
};
