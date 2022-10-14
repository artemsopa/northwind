import { DataSource, Repository } from 'typeorm';
import { Customer } from '@/entities/customers';
import { ApiError } from '@/error';

export class CustomersService {
  private readonly repo: Repository<Customer>;
  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Customer);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('customers').getMany();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));

    return customers;
  }

  async getInfo(id: string) {
    const customer = await this.repo.createQueryBuilder('customers')
      .where('customers.id = :id', { id })
      .getOne();

    if (!customer) throw ApiError.badRequest('Unknown customer!');

    return customer;
  }

  async search(company: string) {
    const data = await this.repo.createQueryBuilder('customers')
      .where('LOWER(customers.company_name) LIKE LOWER(:company)', { company: `%${company}%` })
      .getMany();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return customers;
  }
}
