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
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return suppliers;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);
    if (!data) throw ErrorApi.badRequest('Unknown supplier!');

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
