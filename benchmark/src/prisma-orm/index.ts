import { PrismaClient } from "@prisma/client";

export const getConnection = async () => {
  const prisma = new PrismaClient();
  return prisma;
};
