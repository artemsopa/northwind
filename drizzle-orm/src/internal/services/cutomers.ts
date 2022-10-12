import { ErrorApi } from '@/pkg/error';
import { CustomersRepo } from '@/internal/repositories/customers';

export class CustomersService {
  constructor(private readonly repo: CustomersRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));

    return customers;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    if (!data) throw ErrorApi.badRequest('Unknown customer!');

    const customer = {
      id: data.id,
      companyName: data.companyName,
      contactName: data.contactName,
      contactTitle: data.contactTitle,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      region: data.region,
      country: data.country,
      phone: data.phone,
      fax: data.fax,
    };

    return customer;
  }

  async search(company: string) {
    const data = await this.repo.search(company);

    const customers = data.map((item) => ({
      id: item.id,
      companyName: item.companyName,
      contactName: item.contactName,
      contactTitle: item.contactTitle,
      city: item.city,
      country: item.country,
    }));
    return customers;
  }
}
