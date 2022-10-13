import { ErrorApi } from '@/pkg/error';
import { SuppliersRepo } from '@/internal/repositories/suppliers';

export class SuppliersService {
  constructor(private readonly repo: SuppliersRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

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
    const data = await this.repo.getInfo(id);
    if (data === undefined) throw ErrorApi.badRequest('Unknown supplier!');

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
