import { ErrorApi } from '@/pkg/error';
import { Queue } from '@/pkg/queue';
import { CustomersRepo } from '@/internal/repositories/customers';

export class CustomersService {
  constructor(private readonly repo: CustomersRepo, private readonly queue: Queue) {
    this.repo = repo;
    this.queue = queue;
  }

  async getAll() {
    const { data, query, type, ms } = await this.repo.getAll();

    // await this.queue.enqueueMessage({ query, type, ms });

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
    const { data, query, type, ms } = await this.repo.getInfo(id);
    if (!data) throw ErrorApi.badRequest('Unknown customer!');

    // await this.queue.enqueueMessage({ query, type, ms });

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
    const { data, query, type, ms } = await this.repo.search(company);

    // await this.queue.enqueueMessage({ query, type, ms });

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
