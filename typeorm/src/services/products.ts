import { DataSource, Repository } from 'typeorm';
import { Product } from '@/entities/products';
import { ApiError } from '@/error';

export class ProductsService {
  private readonly repo: Repository<Product>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Product);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('products').getMany();

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qtPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }

  async getInfo(id: string) {
    const data = await this.repo.createQueryBuilder('products')
      .leftJoinAndSelect(
        'products.supplier',
        'suppliers',
      ).where('products.id = :id', { id })
      .getOne();

    if (!data || !data.supplier) throw ApiError.badRequest('Unknown product!');

    const supplier = {
      id: data.supplier.id,
      companyName: data.supplier.companyName,
    };

    const item = {
      id: data.id,
      name: data.name,
      qtPerUnit: data.qtPerUnit,
      unitPrice: data.unitPrice,
      unitsInStock: data.unitsInStock,
      unitsOnOrder: data.unitsOnOrder,
      reorderLevel: data.reorderLevel,
      discontinued: data.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const data = await this.repo.createQueryBuilder('products')
      .where('LOWER(products.name) like LOWER(:name)', { name: `%${name}%` })
      .getMany();

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qtPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }
}
