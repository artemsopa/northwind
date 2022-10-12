import { sql } from 'drizzle-orm';
import { Employee } from '@/internal/repositories/entities/employees';
import { Database } from '@/internal/repositories/entities/schema';

export class EmployeesRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = this.db.employees.select().execute();

    return data;
  }

  async getInfo(id: string) {
    const command = sql`SELECT e1.*, e2.last_name AS reports_lname, e2.first_name AS reports_fname 
    FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.recipient_id WHERE e1.id = ${id}`;

    const { rows: [data] } = await this.db.execute(command);

    return data;
  }

  async createMany(employees: Employee[]): Promise<void> {
    await this.db.employees.insert(employees).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.employees.delete().execute();
  }
}
