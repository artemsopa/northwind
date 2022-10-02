export class OrderItem {
  id: string;
  totalPrice: number;
  products: number;
  quantity: number;
  shipped: Date | null;
  shipName: string;
  city: string;
  country: string;
  constructor(
    id: string,
    totalPrice: number,
    products: number,
    quantity: number,
    shipped: Date | null,
    shipName: string,
    city: string,
    country: string,
  ) {
    this.id = id;
    this.totalPrice = totalPrice;
    this.products = products;
    this.quantity = quantity;
    this.shipped = shipped;
    this.shipName = shipName;
    this.city = city;
    this.country = country;
  }
}

export class OrderProduct {
  id: string;
  name: string;
  quantity: number;
  orderPrice: number;
  totalPrice: number;
  discount: number;
  constructor(
    id: string,
    name: string,
    quantity: number,
    orderPrice: number,
    totalPrice: number,
    discount: number,
  ) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.orderPrice = orderPrice;
    this.totalPrice = totalPrice;
    this.discount = discount;
  }
}

export class OrderInfo {
  id: string;
  shipName: string;
  totalProducts: number;
  totalQuantity: number;
  totalPrice: number;
  totalDiscount: number;
  shipVia: number;
  freight: number;
  orderDate: Date;
  requiredDate: Date;
  shippedDate: Date | null;
  shipCity: string;
  shipRegion: string | null;
  shipPostalCode: string | null;
  shipCountry: string;
  customerId: string;
  products: OrderProduct[];
  constructor(
    id: string,
    shipName: string,
    totalProducts: number,
    totalQuantity: number,
    totalPrice: number,
    totalDiscount: number,
    shipVia: number,
    freight: number,
    orderDate: Date,
    requiredDate: Date,
    shippedDate: Date | null,
    shipCity: string,
    shipRegion: string | null,
    shipPostalCode: string | null,
    shipCountry: string,
    customerId: string,
    products: OrderProduct[],
  ) {
    this.id = id;
    this.shipName = shipName;
    this.totalProducts = totalProducts;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
    this.totalDiscount = totalDiscount;
    this.shipVia = shipVia;
    this.freight = freight;
    this.orderDate = orderDate;
    this.requiredDate = requiredDate;
    this.shippedDate = shippedDate;
    this.shipCity = shipCity;
    this.shipRegion = shipRegion;
    this.shipPostalCode = shipPostalCode;
    this.shipCountry = shipCountry;
    this.customerId = customerId;
    this.products = products;
  }
}
