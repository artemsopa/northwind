import { eq } from 'drizzle-orm/expressions';
import { Supplier, suppliers as table } from './entities/suppliers';
import { Database } from './entities/schema';

export class SuppliersRepo {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const command = this.db.suppliers.select();

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
    const command = this.db.suppliers.select()
      .where(eq(table.id, id));

    const prevMs = Date.now();
    const [data] = await command.execute();
    const ms = Date.now() - prevMs;

    const query = `${command.getQuery().sql}. ${command.getQuery().params}`;

    return {
      data,
      query,
      type: 'WHERE',
      ms,
    };
  }

  async createMany(suppliers: Supplier[]): Promise<void> {
    await this.db.suppliers.insert(suppliers).execute();
  }

  async deleteAll(): Promise<void> {
    await this.db.suppliers.delete().execute();
  }
}
