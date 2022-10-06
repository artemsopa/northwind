import { DataSource, Repository } from 'typeorm';
import { ISuppliersRepo, ItemsWithMetric } from './repositories';
import Supplier from './entities/supplier';
import { QueryTypes } from './entities/metric';

class SuppliersRepo implements ISuppliersRepo {
  private repo: Repository<Supplier>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Supplier);
  }

  async getAll(): Promise<ItemsWithMetric<Supplier[]>> {
    const command = this.repo.createQueryBuilder('suppliers');

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Supplier | null>> {
    const command = this.repo.createQueryBuilder('suppliers')
      .where('suppliers.id = :id', { id });

    const data = await command.getOne();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(suppliers: Supplier[]): Promise<void> {
    await this.repo.save(suppliers);
  }

  async deleteAll(): Promise<void> {
    await this.repo.createQueryBuilder('suppliers').delete().execute();
  }
}

export default SuppliersRepo;
