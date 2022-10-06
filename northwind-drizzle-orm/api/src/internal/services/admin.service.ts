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

    await this.repos.customers.createMany(data.customers.map((item) => new Customer(
      item.CustomerID,
      item.CompanyName,
      item.ContactName,
      item.ContactTitle,
      item.Address,
      item.City,
      item.PostalCode,
      item.Region,
      item.Country,
      item.Phone,
      item.Fax,
    )));

    await this.repos.employees.createMany(
      data.employees
        .sort((e1, e2) => (
          e1.ReportsTo !== null && e2.ReportsTo === null ? 1
            : e1.ReportsTo === null && e2.ReportsTo !== null ? -1
              : (e1.ReportsTo && e2.ReportsTo) && e1.ReportsTo > e2.ReportsTo ? 1
                : (e1.ReportsTo && e2.ReportsTo) && e1.ReportsTo < e2.ReportsTo ? -1 : 0
        ))
        .map((item) => new Employee(
          item.EmployeeID,
          item.LastName,
          item.FirstName,
          item.Title,
          item.TitleOfCourtesy,
          new Date(item.BirthDate),
          new Date(item.HireDate),
          item.Address,
          item.City,
          item.PostalCode,
          item.Country,
          item.HomePhone,
          item.Extension,
          item.Notes,
          item.ReportsTo,
        )),
    );

    await this.repos.orders.createMany(data.orders.map((item) => new Order(
      item.OrderID,
      new Date(item.OrderDate),
      new Date(item.RequiredDate),
      item.ShippedDate ? new Date(item.ShippedDate) : null,
      item.ShipVia,
      item.Freight,
      item.ShipName,
      item.ShipCity,
      item.ShipRegion,
      item.ShipPostalCode,
      item.ShipCountry,
      item.CustomerID,
      item.EmployeeID,
    )));

    await this.repos.suppliers.createMany(data.suppliers.map((item) => new Supplier(
      item.SupplierID,
      item.CompanyName,
      item.ContactName,
      item.ContactTitle,
      item.Address,
      item.City,
      item.Region,
      item.PostalCode,
      item.Country,
      item.Phone,
    )));

    await this.repos.products.createMany(data.products.map((item) => new Product(
      item.ProductID,
      item.ProductName,
      item.QuantityPerUnit,
      item.UnitPrice,
      item.UnitsInStock,
      item.UnitsOnOrder,
      item.ReorderLevel,
      item.Discontinued,
      item.SupplierID,
    )));

    await this.repos.details.createMany(data.orderDetails.map((item) => new Detail(
      item.UnitPrice,
      item.Quantity,
      item.Discount,
      item.OrderID,
      item.ProductID,
    )));
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
