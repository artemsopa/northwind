import { sql } from 'drizzle-orm';
import { Employee, ReportedEmployee } from './entities/employees';
import { IEmployeesRepo, ItemsWithMetric, QueryTypes } from './repositories';
import { DataBase } from './entities/schema';

class EmployeesRepo implements IEmployeesRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Employee[]>> {
    const command = this.db.employees.select();

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<ReportedEmployee | null>> {
    const command = sql`SELECT e1.*, e2.last_name as reports_lname, e2.first_name as reports_fname FROM employees AS e1 LEFT JOIN employees AS e2 ON e2.id = e1.reports_to WHERE e1.id = ${id}`;
    const { rows: [data] } = await this.db.execute<ReportedEmployee>(command);

    const query = `${command.getSQL().queryChunks} ${id}`;
    console.log(data);

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async createMany(employees: Employee[]): Promise<void> {
    await this.db.employees.insert(employees).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.employees.delete().execute();
  }
}

export default EmployeesRepo;
