import { IAdminService } from './services';
import { ICSVReader } from '../../pkg/reader/reader';
import Repositories, { QueryTypes } from '../repositories/repositories';
import { MetricsInfo, MetricItem } from './dtos/metric';
import { Customer } from '../repositories/entities/customers';
import { Employee } from '../repositories/entities/employees';
import { Supplier } from '../repositories/entities/suppliers';
import { Product } from '../repositories/entities/products';
import { Order } from '../repositories/entities/orders';
import { Detail } from '../repositories/entities/details';

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
          birthDate: item.BirthDate,
          hireDate: item.HireDate,
          address: item.Address,
          city: item.City,
          postalCode: item.PostalCode,
          country: item.Country,
          homePhone: item.HomePhone,
          extension: item.Extension,
          notes: item.Notes,
          reportsTo: item.ReportsTo,
        })),
    );

    await this.repos.orders.createMany(data.orders.map((item) => ({
      id: item.OrderID,
      orderDate: item.OrderDate,
      requiredDate: item.RequiredDate,
      shippedDate: item.ShippedDate,
      shipVia: item.ShipVia,
      freight: item.Freight,
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
      unitPrice: item.UnitPrice,
      unitsInStock: item.UnitsInStock,
      unitsOnOrder: item.UnitsOnOrder,
      reorderLevel: item.ReorderLevel,
      discontinued: item.Discontinued,
      supplierId: item.SupplierID,
    })));

    await this.repos.details.createMany(data.orderDetails.map((item) => ({
      unitPrice: item.UnitPrice,
      quantity: item.Quantity,
      discount: item.Discount,
      orderId: item.OrderID,
      productId: item.ProductID,
    })));
  }

  async getAllMetrics(): Promise<MetricsInfo> {
    const metrics = await this.repos.metrics.getAll();

    const map = new Map();
    for (const el of metrics) {
      const counter = map.get(el.queryType);
      map.set(el.queryType, counter ? counter + 1 : 1);
    }

    const info = new MetricsInfo(
      metrics.length || 0,
      map.get(QueryTypes.SELECT) || 0,
      map.get(QueryTypes.SELECT_WHERE) || 0,
      map.get(QueryTypes.SELECT_LEFT_JOIN) || 0,
      map.get(QueryTypes.SELECT_LEFT_JOIN_WHERE) || 0,
      metrics.map((item) => new MetricItem(item.queryString, item.ms, item.created_at)),
    );
    return info;
  }
}

export default AdminService;
