import { PrismaClient } from '@prisma/client';
import { IDetailsRepo } from './repositories';
import { DetailInput } from './types/details';

class DetailsRepo implements IDetailsRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createMany(details: DetailInput[]): Promise<void> {
    await this.prisma.detail.createMany({
      data: details,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.detail.deleteMany();
  }
}

export default DetailsRepo;
