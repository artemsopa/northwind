import { Kysely } from 'kysely';
import { IEmployeesRepo, ItemsWithMetric } from './repositories';
import { Employee, EmployeeWithRecipient } from './types/employee';
import { QueryTypes } from './types/metric';
import Database from './types/types';

class EmployeesRepo implements IEmployeesRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Employee[]>> {
    const command = this.db.selectFrom('employees')
      .selectAll();

    const data = await command.execute() as Employee[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<EmployeeWithRecipient | null>> {
    const command = this.db.selectFrom('employees as e1')
      .selectAll()
      .where('e1.id', '=', id)
      .limit(1)
      .leftJoinLateral(
        (eb) => eb.selectFrom('employees as e2')
          .select(['id as e_id', 'last_name as e_last_name', 'first_name as e_last_name'])
          .whereRef('e1.recipient_id', '=', 'e2.id')
          .as('e2'),
        (join) => join.onTrue(),
      );

    const [data] = await command.execute() as EmployeeWithRecipient[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_LEFT_JOIN_WHERE,
    };
  }

  async createMany(employees: Employee[]): Promise<void> {
    await this.db.insertInto('employees').values(employees).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('employees').execute();
  }
}

export default EmployeesRepo;
