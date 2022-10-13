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
      companyName: item.company_name,
      contactName: item.contact_name,
      contactTitle: item.contact_title,
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
      companyName: data.company_name,
      contactName: data.contact_name,
      contactTitle: data.contact_title,
      address: data.address,
      city: data.city,
      postalCode: data.postal_code,
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
      companyName: item.company_name,
      contactName: item.contact_name,
      contactTitle: item.contact_title,
      city: item.city,
      country: item.country,
    }));
    return customers;
  }
}
