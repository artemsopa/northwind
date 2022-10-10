import { Knex } from 'knex';
import { IEmployeesRepo, ItemsWithMetric } from './repositories';
import { Employee, EmployeeWithRecipient } from './types/employee';
import { QueryTypes } from './types/metric';

class EmployeesRepo implements IEmployeesRepo {
  constructor(private readonly knex: Knex) {
    this.knex = knex;
  }

  async getAll(): Promise<ItemsWithMetric<Employee[]>> {
    const command = this.knex('northwind_schema.employees').select();

    const data = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<EmployeeWithRecipient | undefined>> {
    const command = this.knex('northwind_schema.employees as e1')
      .whereRaw('e1.id = (?)', [id])
      .leftJoin(
        'northwind_schema.employees as e2',
        'e1.recipient_id',
        'e2.id',
      )
      .select(['e1.*', 'e2.id as e_id', 'e2.last_name as e_last_name', 'e2.first_name as e_first_name']);

    const [data] = await command;
    const queryObj = command.toSQL().toNative();
    const query = `${queryObj.sql} [${queryObj.bindings}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async createMany(employees: Employee[]): Promise<void> {
    await this.knex('northwind_schema.employees').insert(employees);
  }

  async deleteAll(): Promise<void> {
    await this.knex('northwind_schema.employees').del();
  }
}

export default EmployeesRepo;
