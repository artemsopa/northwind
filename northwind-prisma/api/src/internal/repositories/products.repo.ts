import { PrismaClient, Product } from '@prisma/client';
import { IProductsRepo } from './repositories';
import { ProductJoinSupplier } from './types/product';

class ProductsRepo implements IProductsRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Product[]> {
    const data = await this.prisma.product.findMany();
    return data;
  }

  async getInfo(id: string): Promise<ProductJoinSupplier | null> {
    const data = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        supplier: true,
      },
    });

    return data;
  }

  async search(name: string): Promise<Product[]> {
    const data = await this.prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return data;
  }

  async createMany(products: Product[]): Promise<void> {
    await this.prisma.product.createMany({
      data: products,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.product.deleteMany();
  }
}

export default ProductsRepo;
