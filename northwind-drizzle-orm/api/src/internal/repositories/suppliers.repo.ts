import { eq } from 'drizzle-orm/expressions';
import { ISuppliersRepo, ItemsWithMetric, QueryTypes } from './repositories';
import { Supplier, suppliers as table } from './entities/suppliers';
import { DataBase } from './entities/schema';

class SuppliersRepo implements ISuppliersRepo {
  constructor(private readonly db: DataBase) {
    this.db = db;
  }

  async getAll(): Promise<ItemsWithMetric<Supplier[]>> {
    const command = this.db.suppliers.select();

    const data = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT,
    };
  }

  async getInfo(id: string): Promise<ItemsWithMetric<Supplier | null>> {
    const command = this.db.suppliers.select()
      .where(eq(table.id, id));

    const [data] = await command.execute();
    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: QueryTypes.SELECT_WHERE,
    };
  }

  async createMany(suppliers: Supplier[]): Promise<void> {
    await this.db.suppliers.insert(suppliers).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.suppliers.delete().execute();
  }
}

export default SuppliersRepo;
