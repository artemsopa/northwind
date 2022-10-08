import { Prisma, QueryType } from '@prisma/client';
import { IAdminService } from './services';
import { ICSVReader } from '../../pkg/reader/reader';
import Repositories from '../repositories/repositories';
import { MetricsInfo, MetricItem } from './dtos/metric';

class AdminService implements IAdminService {
  constructor(private readonly reader: ICSVReader, private readonly repos: Repositories) {
    this.reader = reader;
    this.repos = repos;
  }

  async rewriteData(): Promise<void> {
    await this.repos.customers.deleteAll();
    await this.repos.employees.deleteAll();
    await this.repos.orders.deleteAll();
    await this.repos.suppliers.deleteAll();
    await this.repos.products.deleteAll();
    await this.repos.details.deleteAll();

    const data = await this.reader.readAllCSVs();

    await this.repos.customers.createMany(data.customers.map((item) => ({
      id: item.CustomerID,
      companyName: item.CompanyName,
      contactName: item.ContactName,
      contactTitle: item.ContactTitle,
      address: item.Address,
      city: item.City,
      postalCode: item.PostalCode,
      region: item.Region,
      country: item.Country,
      phone: item.Phone,
      fax: item.Fax,
    })));

    await this.repos.employees.createMany(
      data.employees
        .sort((e1, e2) => (
          e1.ReportsTo !== null && e2.ReportsTo === null ? 1
            : e1.ReportsTo === null && e2.ReportsTo !== null ? -1
              : (e1.ReportsTo && e2.ReportsTo) && e1.ReportsTo > e2.ReportsTo ? 1
                : (e1.ReportsTo && e2.ReportsTo) && e1.ReportsTo < e2.ReportsTo ? -1 : 0
        ))
        .map((item) => ({
          id: item.EmployeeID,
          lastName: item.LastName,
          firstName: item.FirstName,
          title: item.Title,
          titleOfCourtesy: item.TitleOfCourtesy,
          birthDate: new Date(item.BirthDate),
          hireDate: new Date(item.HireDate),
          address: item.Address,
          city: item.City,
          postalCode: item.PostalCode,
          country: item.Country,
          homePhone: item.HomePhone,
          extension: Number(item.Extension),
          notes: item.Notes,
          recipientId: item.ReportsTo,
        })),
    );

    await this.repos.orders.createMany(data.orders.map((item) => ({
      id: item.OrderID,
      orderDate: new Date(item.OrderDate),
      requiredDate: new Date(item.RequiredDate),
      shippedDate: new Date(item.ShippedDate),
      shipVia: Number(item.ShipVia),
      freight: new Prisma.Decimal(item.Freight),
      shipName: item.ShipName,
      shipCity: item.ShipCity,
      shipRegion: item.ShipRegion,
      shipPostalCode: item.ShipPostalCode,
      shipCountry: item.ShipCountry,
      customerId: item.CustomerID,
      employeeId: item.EmployeeID,
    })));

    await this.repos.suppliers.createMany(data.suppliers.map((item) => ({
      id: item.SupplierID,
      companyName: item.CompanyName,
      contactName: item.ContactName,
      contactTitle: item.ContactTitle,
      address: item.Address,
      city: item.City,
      region: item.Region,
      postalCode: item.PostalCode,
      country: item.Country,
      phone: item.Phone,
    })));

    await this.repos.products.createMany(data.products.map((item) => ({
      id: item.ProductID,
      name: item.ProductName,
      quantityPerUnit: item.QuantityPerUnit,
      unitPrice: new Prisma.Decimal(item.UnitPrice),
      unitsInStock: Number(item.UnitsInStock),
      unitsOnOrder: Number(item.UnitsOnOrder),
      reorderLevel: Number(item.ReorderLevel),
      discontinued: Number(item.Discontinued),
      supplierId: item.SupplierID,
    })));

    await this.repos.details.createMany(data.orderDetails.map((item) => ({
      unitPrice: new Prisma.Decimal(item.UnitPrice),
      quantity: Number(item.Quantity),
      discount: new Prisma.Decimal(item.Discount),
      orderId: item.OrderID,
      productId: item.ProductID,
    })));
  }

  async getAllMetrics(): Promise<MetricsInfo> {
    const metrics = await this.repos.metrics.getAll();

    const map = new Map();
    for (const el of metrics) {
      const counter = map.get(el.type);
      map.set(el.type, counter ? counter + 1 : 1);
    }

    const info = new MetricsInfo(
      metrics.length || 0,
      map.get(QueryType.SELECT) || 0,
      map.get(QueryType.SELECT_WHERE) || 0,
      map.get(QueryType.SELECT_LEFT_JOIN) || 0,
      map.get(QueryType.SELECT_LEFT_JOIN_WHERE) || 0,
      metrics.map((item) => ({ query: item.query, ms: item.ms, date: item.createdAt })),
    );
    return info;
  }
}

export default AdminService;
