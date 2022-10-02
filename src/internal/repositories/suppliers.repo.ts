import { DataSource, Repository } from 'typeorm';
import { IMetricsRepo, ISuppliersRepo } from './repositories';
import Supplier from './entities/supplier';
import { QueryTypes } from './entities/metric';

class SuppliersRepo implements ISuppliersRepo {
  private repo: Repository<Supplier>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Supplier);
  }

  async getAll(): Promise<{ suppliers: Supplier[], query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('suppliers');

    const suppliers = await query.getMany();

    return {
      suppliers,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<{ supplier: Supplier | null, query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('suppliers')
      .where('suppliers.id = :id', { id });

    const supplier = await query.getOne();

    return {
      supplier,
      query: query.getQueryAndParameters().toString(),
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
