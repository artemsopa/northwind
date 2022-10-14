import { eq } from 'drizzle-orm/expressions';
import { ApiError } from '@/app';
import { suppliers as table } from '@/entities/suppliers';
import { Database } from '@/entities/schema';

export class SuppliersService {
  constructor(private readonly db: Database) {
    this.db = db;
  }

  async getAll() {
    const data = await this.db.suppliers.select().execute();

    const suppliers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return suppliers;
  }

  async getInfo(id: string) {
    const [data] = await this.db.suppliers.select()
      .where(eq(table.id, id))
      .execute();

    if (!data) throw ApiError.badRequest('Unknown supplier!');

    const supplier = {
      id: data.id,
      companyName: data.companyName,
      contactName: data.contactName,
      contactTitle: data.contactTitle,
      address: data.address,
      city: data.city,
      region: data.region,
      postalCode: data.postalCode,
      country: data.country,
      phone: data.phone,
    };
    return supplier;
  }
}
