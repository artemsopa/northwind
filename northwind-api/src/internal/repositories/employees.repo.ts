import { DataSource, Repository } from 'typeorm';
import { IEmployeesRepo, IMetricsRepo } from './repositories';
import Employee from './entities/employee';
import { QueryTypes } from './entities/metric';

class EmployeesRepo implements IEmployeesRepo {
  private repo: Repository<Employee>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Employee);
  }

  async getAll(): Promise<{ employees: Employee[], query: string, type: QueryTypes }> {
    const query = this.repo.createQueryBuilder('employees');

    const employees = await query.getMany();

    return {
      employees,
      query: query.getQueryAndParameters().toString(),
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<{ employee: Employee | null, query: string, type: QueryTypes }> {
    const query = this.repo
      .createQueryBuilder('employees')
      .leftJoinAndSelect(
        'employees.recipient',
        'recipients',
      ).where('employees.id = :id', { id });

    const employee = await query.getOne();

    return {
      employee,
      query: query.getQueryAndParameters().toString(),
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
