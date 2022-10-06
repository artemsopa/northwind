import { eq, ilike } from 'drizzle-orm/expressions';
import { customers as table, Customer } from './entities/customers';
import { ICustomersRepo, ItemsWithMetric, QueryTypes } from './repositories';
import { DataBase } from './entities/schema';

class CustomersRepo implements ICustomersRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.db.customers.select();

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Customer | null>> {
    const command = this.db.customers.select()
      .where(eq(table.id, id));

    const [data] = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async search(company: string): Promise<ItemsWithMetric<Customer[]>> {
    const command = this.db.customers.select()
      .where(ilike(table.companyName, `%${company}%`));

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(customers: Customer[]): Promise<void> {
    await this.db.customers.insert(customers).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.customers.delete().execute();
  }
}

export default CustomersRepo;
