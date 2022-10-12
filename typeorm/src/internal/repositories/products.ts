import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/products';

export class ProductsRepo {
  private readonly repo: Repository<Product>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Product);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('products').getMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.repo.createQueryBuilder('products')
      .leftJoinAndSelect(
        'products.supplier',
        'suppliers',
      ).where('products.id = :id', { id })
      .getOne();

    return data;
  }

  async search(name: string) {
    const data = await this.repo.createQueryBuilder('products')
      .where('LOWER(products.name) like LOWER(:name)', { name: `%${name}%` })
      .getMany();

    return data;
  }
}
