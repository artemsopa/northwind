import { EntityManager } from '@mikro-orm/core';
import { Customer } from '@/entities/customers';
import { ApiError } from '@/error';

export class CustomersService {
  constructor(private readonly em: EntityManager) {
    this.em = em;
  }

  async getAll() {
    const data = await this.em.find(Customer, {});
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
    const customer = await this.em.findOne(Customer, { id });
    if (!customer) throw ApiError.badRequest('Unknown customer!');
    return customer;
  }

  async search(company: string) {
    const data = await this.em.find(Customer, {
      companyName: { $ilike: `%${company}%` },
    });
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
