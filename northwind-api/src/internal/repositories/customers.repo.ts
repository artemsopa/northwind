import { DataSource, Repository } from 'typeorm';
import { ICustomersRepo, IMetricsRepo } from './repositories';
import Customer from './entities/customer';
import { QueryTypes } from './entities/metric';

class CustomersRepo implements ICustomersRepo {
  private repo: Repository<Customer>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Customer);
  }

  async getAll(): Promise<{ customers: Customer[], query: string, type: QueryTypes}> {
    const query = this.repo.createQueryBuilder('customers');
    const customers = await query.getMany();

    return {
      customers,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<{ customer: Customer | null, query: string, type: QueryTypes}> {
    const query = this.repo.createQueryBuilder('customers')
      .where('customers.id = :id', { id });
    const customer = await query.getOne();

    return {
      customer,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async search(company: string): Promise<{ customers: Customer[], query: string, type: QueryTypes}> {
    const query = this.repo.createQueryBuilder('customers')
      .where('LOWER(customers.company_name) LIKE LOWER(:company)', { company: `%${company}%` });

    const customers = await query.getMany();

    return {
      customers,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(customers: Customer[]): Promise<void> {
    await this.repo.save(customers);
  }

  async deleteAll(): Promise<void> {
    await this.repo.createQueryBuilder('customers').delete().execute();
  }
}

export default CustomersRepo;
