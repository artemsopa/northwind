import { PrismaClient } from '@/prisma-orm/client';

export const getConnection = async () => {
  const prisma = new PrismaClient();
  return prisma;
};
