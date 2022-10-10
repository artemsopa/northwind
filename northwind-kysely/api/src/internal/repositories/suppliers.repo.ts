import { Kysely } from 'kysely';
import { ISuppliersRepo, ItemsWithMetric } from './repositories';
import { Supplier } from './types/supplier';
import { QueryTypes } from './types/metric';
import Database from './types/types';

class SuppliersRepo implements ISuppliersRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Supplier[]>> {
    const command = this.db.selectFrom('suppliers')
      .selectAll();

    const data = await command.execute() as Supplier[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Supplier | null>> {
    const command = this.db.selectFrom('suppliers')
      .selectAll()
      .where('suppliers.id', '=', id)
      .limit(1);

    const [data] = await command.execute() as Supplier[];
    const queryObj = command.compile();
    const query = `${queryObj.sql} [${queryObj.parameters}]`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(suppliers: Supplier[]): Promise<void> {
    await this.db.insertInto('suppliers').values(suppliers).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.deleteFrom('suppliers').execute();
  }
}

export default SuppliersRepo;
