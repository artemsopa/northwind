import { DataSource, Repository } from 'typeorm';
import { IEmployeesRepo, ItemsWithMetric } from './repositories';
import Employee from './entities/employee';
import { QueryTypes } from './entities/metric';

class EmployeesRepo implements IEmployeesRepo {
  private repo: Repository<Employee>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Employee);
  }

  async getAll(): Promise<ItemsWithMetric<Employee[]>> {
    const command = this.repo.createQueryBuilder('employees');

    const data = await command.getMany();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Employee | null>> {
    const command = this.repo.createQueryBuilder('employees')
      .leftJoinAndSelect(
        'employees.recipient',
        'recipients',
      ).where('employees.id = :id', { id });

    const data = await command.getOne();
    const query = command.getQueryAndParameters().toString();

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async createMany(customers: Employee[]): Promise<void> {
    await this.repo.save(customers);
  }

  async deleteAll(): Promise<void> {
    await this.repo.createQueryBuilder('employees')
      .delete()
      .where('employees.reports_to = NULL')
      .delete()
      .execute();
  }
}

export default EmployeesRepo;
