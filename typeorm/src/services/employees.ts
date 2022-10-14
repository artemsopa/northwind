import { DataSource, Repository } from 'typeorm';
import { Employee } from '@/entities/employees';
import { ApiError } from '@/error';

export class EmployeesService {
  private readonly repo: Repository<Employee>;
  constructor(ds: DataSource) {
    this.repo = ds.getRepository(Employee);
  }

  async getAll() {
    const data = await this.repo.createQueryBuilder('employees').getMany();

    const employees = data.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      title: item.title,
      city: item.city,
      homePhone: item.homePhone,
      country: item.country,
    }));
    return employees;
  }

  async getInfo(id: string) {
    const data = await this.repo.createQueryBuilder('employees')
      .leftJoinAndSelect(
        'employees.recipient',
        'recipients',
      ).where('employees.id = :id', { id })
      .getOne();

    if (!data) throw ApiError.badRequest('Unknown employee!');

    const recipient = data.recipientId ? ({
      id: data.recipient.id,
      firstName: data.recipient.firstName,
      lastName: data.recipient.lastName,
    }) : null;

    const employee = ({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      titleOfCourtesy: data.titleOfCourtesy,
      bithDate: data.birthDate,
      hireDate: data.hireDate,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
      homePhone: data.homePhone,
      extension: data.extension,
      notes: data.notes,
      recipient,
    });
    return employee;
  }
}
