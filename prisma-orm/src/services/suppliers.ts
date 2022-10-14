import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/error';

export class SuppliersService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.supplier.findMany();

    const suppliers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return suppliers;
  }

  async getInfo(id: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id,
      },
    });

    if (!supplier) throw ApiError.badRequest('Unknown supplier!');

    return supplier;
  }
}
