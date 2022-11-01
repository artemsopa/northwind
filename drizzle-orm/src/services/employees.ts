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
    const command = sql`select "e1".*, "e2"."last_name" as "reports_lname", "e2"."first_name" as "reports_fname" 
    from "employees" as "e1" left join "employees" as "e2" on "e2"."id" = "e1"."recipient_id" where "e1"."id" = ${id}`;

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
