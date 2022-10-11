import { sql } from 'drizzle-orm';
import { Employee } from '@/internal/repositories/entities/employees';
import { Database } from '@/internal/repositories/entities/schema';

export class EmployeesRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = this.db.employees.select();

    const prevMs = Date.now();
    const data = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'SELECT',
      ms,
    };
  }

  async getInfo(id: string) {
    const command = sql`SELECT e1.*, e2.last_name as reports_lname, e2.first_name as reports_fname FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.recipient_id WHERE e1.id = ${id}`;

    const prevMs = Date.now();
    const { rows: [data] } = await this.db.execute(command);
    const ms = Date.now() - prevMs;

    const query = `${command.getSQL().queryChunks} ${id}`;

    return {
      data,
      query,
      type: 'JOIN',
      ms,
    };
  }

  async createMany(employees: Employee[]): Promise<void> {
    await this.db.employees.insert(employees).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.employees.delete().execute();
  }
}
