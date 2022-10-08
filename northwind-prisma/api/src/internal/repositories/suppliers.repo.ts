import { PrismaClient, Supplier } from '@prisma/client';
import { ISuppliersRepo } from './repositories';

class SuppliersRepo implements ISuppliersRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Supplier[]> {
    const data = await this.prisma.supplier.findMany();

    return data;
  }

  async getInfo(id: string): Promise<Supplier | null> {
    const data = await this.prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    return data;
  }

  async createMany(suppliers: Supplier[]): Promise<void> {
    await this.prisma.supplier.createMany({
      data: suppliers,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.supplier.deleteMany();
  }
}

export default SuppliersRepo;
