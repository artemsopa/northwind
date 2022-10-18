import { sql } from 'drizzle-orm';
import { ApiError } from '@/error';
import { Database } from '@/data/schema';

export class EmployeesService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.employees.select().execute();

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
    const command = sql`SELECT e1.*, e2.last_name AS reports_lname, e2.first_name AS reports_fname 
    FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.recipient_id WHERE e1.id = ${id}`;

    const { rows: [data] } = await this.db.execute(command);

    if (!data) throw ApiError.badRequest('Unknown employee!');

    const recipient = data.recipient_id ? {
      id: data.recipient_id,
      firstName: data.reports_fname,
      lastName: data.reports_lname,
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
