export class ProductItem {
  id: string;
  name: string;
  quantityPerUnit: string;
  price: number;
  stock: number;
  orders: number;
  constructor(
    id: string,
    name: string,
    quantityPerUnit: string,
    price: number,
    stock: number,
    orders: number,
  ) {
    this.id = id;
    this.name = name;
    this.quantityPerUnit = quantityPerUnit;
    this.price = price;
    this.stock = stock;
    this.orders = orders;
  }
}

export class ProductSupplier {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class ProductInfo {
  id: string;
  name: string;
  quantityPerUnit: string;
  unitPrice: number;
  unitsInStock: number;
  unitsOnOrder: number;
  reorderLevel: number;
  discontinued: number;
  supplier: ProductSupplier | null;
  constructor(
    id: string,
    name: string,
    quantityPerUnit: string,
    unitPrice: number,
    unitsInStock: number,
    unitsOnOrder: number,
    reorderLevel: number,
    discontinued: number,
    supplier: ProductSupplier | null,
  ) {
    this.id = id;
    this.name = name;
    this.quantityPerUnit = quantityPerUnit;
    this.unitPrice = unitPrice;
    this.unitsInStock = unitsInStock;
    this.unitsOnOrder = unitsOnOrder;
    this.reorderLevel = reorderLevel;
    this.discontinued = discontinued;
    this.supplier = supplier;
  }
}
