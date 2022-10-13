import { DataSource, Repository } from 'typeorm';
import { Customer } from '@/internal/repositories/entities/customers';

export class CustomersRepo {
  private readonly repo: Repository<Customer>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Customer);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('customers').getMany();

    return data;
  }

  async getInfo(id: string) {
    const data = await this.repo.createQueryBuilder('customers')
      .where('customers.id = :id', { id })
      .getOne();

    return data;
  }

  async search(company: string) {
    const data = await this.repo.createQueryBuilder('customers')
      .where('LOWER(customers.company_name) LIKE LOWER(:company)', { company: `%${company}%` })
      .getMany();

    return data;
  }
}
