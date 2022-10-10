import { Kysely, sql } from 'kysely';
import { ICustomersRepo, ItemsWithMetric } from './repositories';
import { Customer } from './types/customer';
import { QueryTypes } from './types/metric';
import Database from './types/types';

class CustomersRepo implements ICustomersRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.db.selectFrom('customers').selectAll();

    const data = await command.execute();
    console.log(data);
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;
    console.log(query);

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Customer | null>> {
    const command = this.db.selectFrom('customers')
      .selectAll()
      .where('customers.id', '=', id)
      .limit(1);

    const [data] = await command.execute() as Customer[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;
    console.log(query);

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async search(company: string): Promise<ItemsWithMetric<Customer[]>> {
    // const command = this.knex('northwind_schema.customers')
    //   .whereRaw('LOWER(company_name) LIKE LOWER(?)', [`%${company}%`]).select();

    const command = this.db.selectFrom('customers')
      .selectAll()
      .where(sql`lower(company_name)`, 'like', `%${company.toLowerCase()}%`);

    const data = await command.execute() as Customer[];
    console.log(data);
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;
    console.log(query);

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async createMany(customers: Customer[]): Promise<void> {
    await this.db.insertInto('customers').values(customers).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('customers').execute();
  }
}

export default CustomersRepo;
