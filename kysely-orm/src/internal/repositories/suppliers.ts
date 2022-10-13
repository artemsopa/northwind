import { Kysely } from 'kysely';
import { Database } from '@/internal/repositories/interfaces/interfaces';

export class SuppliersRepo {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('suppliers').selectAll().execute();

    return data;
  }

  async getInfo(id: string) {
    const [data] = await this.db.selectFrom('suppliers')
      .selectAll()
      .where('suppliers.id', '=', id)
      .limit(1)
      .execute();

    return data;
  }
}
