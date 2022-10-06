import { DataSource, Repository } from 'typeorm';
import { ICustomersRepo, ItemsWithMetric } from './repositories';
import Customer from './entities/customer';
import { QueryTypes } from './entities/metric';

class CustomersRepo implements ICustomersRepo {
  private repo: Repository<Customer>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Customer);
  }

  async getAll(): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.repo.createQueryBuilder('customers');

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Customer | null>> {
    const command = this.repo.createQueryBuilder('customers')
      .where('customers.id = :id', { id });

    const data = await command.getOne();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async search(company: string): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.repo.createQueryBuilder('customers')
      .where('LOWER(customers.company_name) LIKE LOWER(:company)', { company: `%${company}%` });

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
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
