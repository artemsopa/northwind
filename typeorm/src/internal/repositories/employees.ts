import { DataSource, Repository } from 'typeorm';
import { Employee } from '@/internal/repositories/entities/employees';

export class EmployeesRepo {
  private readonly repo: Repository<Employee>;

  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Employee);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('employees').getMany();

    return data;
  }

  async getInfo(id: string) {
    const data = this.repo.createQueryBuilder('employees')
      .leftJoinAndSelect(
        'employees.recipient',
        'recipients',
      ).where('employees.id = :id', { id })
      .getOne();

    return data;
  }
}
