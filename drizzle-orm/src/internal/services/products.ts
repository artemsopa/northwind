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
      qtPerUnit: item.quantityPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    if (!data || !data.products || !data.suppliers) throw ErrorApi.badRequest('Unknown product!');

    const supplier = {
      id: data.suppliers.id,
      companyName: data.suppliers.companyName,
    };

    const item = {
      id: data.products.id,
      name: data.products.name,
      qtPerUnit: data.products.quantityPerUnit,
      unitPrice: data.products.unitPrice,
      unitsInStock: data.products.unitsInStock,
      unitsOnOrder: data.products.unitsOnOrder,
      reorderLevel: data.products.reorderLevel,
      discontinued: data.products.discontinued,
      supplier,
    };
    return item;
  }

  async search(name: string) {
    const data = await this.repo.search(name);

    const products = data.map((item) => ({
      id: item.id,
      name: item.name,
      qtPerUnit: item.quantityPerUnit,
      unitPrice: item.unitPrice,
      unitsInStock: item.unitsInStock,
      unitsOnOrder: item.unitsOnOrder,
    }));
    return products;
  }
}
