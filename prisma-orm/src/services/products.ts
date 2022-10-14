import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/error';

export class ProductsService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.product.findMany();

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.quantityPerUnit,
      unitPrice: Number(item.unitPrice),
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }

  async getInfo(id: string) {
    const data = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        supplier: true,
      },
    });

    if (!data) throw ApiError.badRequest('Unknown product!');

    const supplier = {
      id: data.supplier.id,
      companyName: data.supplier.companyName,
    };

    const item = {
      id: data.id,
      name: data.name,
      qtPerUnit: data.quantityPerUnit,
      unitPrice: Number(data.unitPrice),
      unitsInStock: data.unitsInStock,
      unitsOnOrder: data.unitsOnOrder,
      reorderLevel: data.reorderLevel,
      discontinued: data.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const data = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.quantityPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }
}
