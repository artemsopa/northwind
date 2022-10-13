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
      qtPerUnit: item.qt_per_unit,
      unitPrice: item.unit_price,
      unitsInStock: item.units_in_stock,
      unitsOnOrder: item.units_on_order,
    }));
    return products;
  }

  async getInfo(id: string) {
    const data = await this.repo.getInfo(id);

    if (!data) throw ErrorApi.badRequest('Unknown product!');

    const supplier = {
      id: data.s_id,
      companyName: data.s_company_name,
    };

    const item = {
      id: data.id,
      name: data.name,
      qtPerUnit: data.qt_per_unit,
      unitPrice: data.unit_price,
      unitsInStock: data.units_in_stock,
      unitsOnOrder: data.units_on_order,
      reorderLevel: data.reorder_level,
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
      qtPerUnit: item.qt_per_unit,
      unitPrice: item.unit_price,
      unitsInStock: item.units_in_stock,
      unitsOnOrder: item.units_on_order,
    }));
    return products;
  }
}
