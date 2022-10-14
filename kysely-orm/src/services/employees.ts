import { Kysely } from 'kysely';
import { Database, EmployeeWithRecipient } from '@/dtos';
import { ApiError } from '@/error';

export class EmployeesService {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('employees').selectAll().execute();

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
    const [data] = await this.db.selectFrom('employees as e1')
      .selectAll()
      .where('e1.id', '=', id)
      .limit(1)
      .leftJoinLateral(
        (eb) => eb.selectFrom('employees as e2')
          .select(['id as e_id', 'last_name as e_last_name', 'first_name as e_first_name'])
          .whereRef('e1.recipient_id', '=', 'e2.id')
          .as('e2'),
        (join) => join.onTrue(),
      )
      .execute() as EmployeeWithRecipient[];

    if (!data) throw ApiError.badRequest('Unknown employee!');

    const recipient = data.recipient_id ? {
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
