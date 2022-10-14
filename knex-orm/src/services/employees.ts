import { Knex } from 'knex';
import { ApiError } from '@/error';

export class EmployeesService {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll() {
    const data = await this.knex('public.employees').select();

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
    const [data] = await this.knex('public.employees as e1')
      .whereRaw('e1.id = (?)', [id])
      .leftJoin(
        'public.employees as e2',
        'e1.recipient_id',
        'e2.id',
      )
      .select(['e1.*', 'e2.id as e_id', 'e2.last_name as e_last_name', 'e2.first_name as e_first_name']);

    if (data === undefined) throw ApiError.badRequest('Unknown employee!');

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
