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
    const [data] = await this.db.selectFrom('suppliers')
      .selectAll()
      .where('suppliers.id', '=', id)
      .limit(1)
      .execute();

    if (!data) throw ApiError.badRequest('Unknown supplier!');

    const supplier = {
      id: data.id,
      companyName: data.company_name,
      contactName: data.contact_name,
      contactTitle: data.contact_title,
      address: data.address,
      city: data.city,
      region: data.region,
      postalCode: data.postal_code,
      country: data.country,
      phone: data.phone,
    };

    return supplier;
  }
}
