import { ErrorApi } from '@/pkg/error';
import { ProductsRepo } from '@/internal/repositories/products';

export class ProductsService {
  constructor(private readonly repo: ProductsRepo) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qtPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    if (!data || !data.supplier) throw ErrorApi.badRequest('Unknown product!');

    const supplier = {
      id: data.supplier.id,
      companyName: data.supplier.companyName,
    };

    const item = {
      id: data.id,
      name: data.name,
      qtPerUnit: data.qtPerUnit,
      unitPrice: data.unitPrice,
      unitsInStock: data.unitsInStock,
      unitsOnOrder: data.unitsOnOrder,
      reorderLevel: data.reorderLevel,
      discontinued: data.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const data = await this.repo.search(name);

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.qtPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }
}
