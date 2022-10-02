import { DataSource, Repository } from 'typeorm';
import { IMetricsRepo, IProductsRepo } from './repositories';
import Product from './entities/product';
import { QueryTypes } from './entities/metric';

class ProductsRepo implements IProductsRepo {
  private repo: Repository<Product>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Product);
  }

  async getAll(): Promise<{ products: Product[], query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('products');

    const products = await query.getMany();

    return {
      products,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async getInfo(id: string): Promise<{ product: Product | null, query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('products')
      .leftJoinAndSelect(
        'products.supplier',
        'suppliers',
      ).where('products.id = :id', { id });

    const product = await query.getOne();

    return {
      product,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async getById(id: string): Promise<Product | null> {
    const query = this.repo.createQueryBuilder('products')
      .where('products.id = :id', { id });

    const product = await query.getOne();

    return product;
  }

  async search(name: string): Promise<{ products: Product[], query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('products')
      .where('LOWER(products.name) like LOWER(:name)', { name: `%${name}%` });

    const products = await query.getMany();

    return {
      products,
      query: query.getQueryAndParameters().toString(),
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
