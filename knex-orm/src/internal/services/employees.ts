import { ErrorApi } from '@/pkg/error';
import { EmployeesRepo } from '@/internal/repositories/employees';

export class EmployeesService {
  constructor(private readonly repo: EmployeesRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

    const employees = data.map((item) => ({
      id: item.id,
      firstName: item.first_name,
      lastName: item.last_name,
      title: item.title,
      city: item.city,
      homePhone: item.home_phone,
      country: item.country,
    }));
    return employees;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    if (data === undefined) throw ErrorApi.badRequest('Unknown employee!');

    const recipient = data.e_id ? {
      id: data.e_id,
      firstName: data.e_first_name,
      lastName: data.e_last_name,
    } : null;

    const employee = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      title: data.title,
      titleOfCourtesy: data.title_of_courtesy,
      bithDate: data.birth_date,
      hireDate: data.hire_date,
      address: data.address,
      city: data.city,
      postalCode: data.postal_code,
      country: data.country,
      homePhone: data.home_phone,
      extension: data.extension,
      notes: data.notes,
      recipient,
    };
    return employee;
  }
}
