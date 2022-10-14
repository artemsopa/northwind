import { DataSource, Repository } from 'typeorm';
import { Supplier } from '@/entities/suppliers';
import { ApiError } from '@/error';

export class SuppliersService {
  private readonly repo: Repository<Supplier>;
  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Supplier);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('suppliers').getMany();

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
    const data = await this.repo.createQueryBuilder('suppliers')
      .where('suppliers.id = :id', { id })
      .getOne();

    if (!data) throw ApiError.badRequest('Unknown supplier!');

    const supplier = {
      id: data.id,
      companyName: data.companyName,
      contactName: data.contactName,
      contactTitle: data.contactTitle,
      address: data.address,
      city: data.city,
      region: data.region,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
    };
    return supplier;
  }
}
