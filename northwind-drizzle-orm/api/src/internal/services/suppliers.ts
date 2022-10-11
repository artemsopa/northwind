import { ErrorApi } from '../../pkg/error';
import { Queue } from '../../pkg/queue';
import { SuppliersRepo } from '../repositories/suppliers';

export class SuppliersService {
  constructor(private readonly repo: SuppliersRepo, private readonly queue: Queue) {
    this.repo = repo;
    this.queue = queue;
  }

  async getAll() {
    const { data, query, type, ms } = await this.repo.getAll();

    // await this.queue.enqueueMessage({ query, type, ms });

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
    const { data, query, type, ms } = await this.repo.getInfo(id);
    if (!data) throw ErrorApi.badRequest('Unknown supplier!');

    // await this.queue.enqueueMessage({ query, type, ms });

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
