import { EntityManager } from '@mikro-orm/core';
import { Product } from '@/entities/products';
import { ApiError } from '@/error';

export class ProductsService {
  constructor(private readonly em: EntityManager) {
    this.em = em;
  }

  async getAll() {
    const data = await this.em.find(Product, {});

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qtPerUnit,
      unitPrice: Number(item.unitPrice),
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }

  async getInfo(id: string) {
    const data = await this.em.findOne(
      Product,
      { id },
      {
        populate: ['supplier'],
      },
    );

    if (!data || !data.supplier) throw ApiError.badRequest('Unknown product!');

    const supplier = {
      id: data.supplier.id,
      companyName: data.supplier.companyName,
    };

    const item = {
      id: data.id,
      name: data.name,
      qtPerUnit: data.qtPerUnit,
      unitPrice: Number(data.unitPrice),
      unitsInStock: data.unitsInStock,
      unitsOnOrder: data.unitsOnOrder,
      reorderLevel: data.reorderLevel,
      discontinued: data.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const data = await this.em.find(Product, {
      name: { $ilike: `%${name}%` },
    });

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qtPerUnit,
      unitPrice: Number(item.unitPrice),
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }
}
