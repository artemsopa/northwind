import { DataSource, Repository } from 'typeorm';
import { Supplier } from '@/internal/repositories/entities/suppliers';

export class SuppliersRepo {
  private readonly repo: Repository<Supplier>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Supplier);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('suppliers').getMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.repo.createQueryBuilder('suppliers')
      .where('suppliers.id = :id', { id })
      .getOne();

    return data;
  }
}
