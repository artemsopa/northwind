import { EntityManager } from '@mikro-orm/core';
import { Supplier } from '@/entities/suppliers';
import { ApiError } from '@/error';

export class SuppliersService {
  constructor(private readonly em: EntityManager) {
    this.em = em;
  }

  async getAll() {
    const data = await this.em.find(Supplier, {});

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
    const supplier = await this.em.findOne(Supplier, { id });
    if (!supplier) throw ApiError.badRequest('Unknown supplier!');
    return supplier;
  }
}
