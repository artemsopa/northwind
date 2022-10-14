import { Kysely } from 'kysely';
import { Database } from '@/dtos';
import { ApiError } from '@/error';

export class SuppliersService {
  constructor(private readonly db: Kysely<Database>) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.selectFrom('suppliers').selectAll().execute();

    const suppliers = data.map((item) => ({
      id: item.id,
      companyName: item.company_name,
      contactName: item.contact_name,
      contactTitle: item.contact_title,
      city: item.city,
      country: item.country,
    }));
    return suppliers;
  }

  async getInfo(id: string) {
    const [supplier] = await this.db.selectFrom('suppliers')
      .selectAll()
      .where('suppliers.id', '=', id)
      .limit(1)
      .execute();

    if (!supplier) throw ApiError.badRequest('Unknown supplier!');

    return supplier;
  }
}
