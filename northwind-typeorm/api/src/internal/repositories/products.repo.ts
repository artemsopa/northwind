import { DataSource, Repository } from 'typeorm';
import { IProductsRepo, ItemsWithMetric } from './repositories';
import Product from './entities/product';
import { QueryTypes } from './entities/metric';

class ProductsRepo implements IProductsRepo {
  private repo: Repository<Product>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Product);
  }

  async getAll(): Promise<ItemsWithMetric<Product[]>> {
    const command = this.repo.createQueryBuilder('products');

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Product | null>> {
    const command = this.repo.createQueryBuilder('products')
      .leftJoinAndSelect(
        'products.supplier',
        'suppliers',
      ).where('products.id = :id', { id });

    const data = await command.getOne();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async search(name: string): Promise<ItemsWithMetric<Product[]>> {
    const command = this.repo.createQueryBuilder('products')
      .where('LOWER(products.name) like LOWER(:name)', { name: `%${name}%` });

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(products: Product[]): Promise<void> {
    await this.repo.save(products);
  }

  async deleteAll(): Promise<void> {
    await this.repo.createQueryBuilder('products').delete().execute();
  }
}

export default ProductsRepo;
