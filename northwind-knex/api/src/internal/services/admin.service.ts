import { IAdminService } from './services';
import { ICSVReader } from '../../pkg/reader/reader';
import Repositories from '../repositories/repositories';
import { MetricsInfo, MetricItem } from './dtos/metric';
import { QueryTypes } from '../repositories/types/metric';

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
      company_name: item.CompanyName,
      contact_name: item.ContactName,
      contact_title: item.ContactTitle,
      address: item.Address,
      city: item.City,
      postal_code: item.PostalCode,
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
              : e1.ReportsTo > e2.ReportsTo ? 1
                : e1.ReportsTo < e2.ReportsTo ? -1 : 0
        ))
        .map((item) => ({
          id: item.EmployeeID,
          last_name: item.LastName,
          first_name: item.FirstName,
          title: item.Title,
          title_of_courtesy: item.TitleOfCourtesy,
          birth_date: new Date(item.BirthDate),
          hire_date: new Date(item.HireDate),
          address: item.Address,
          city: item.City,
          postal_code: item.PostalCode,
          country: item.Country,
          home_phone: item.HomePhone,
          extension: item.Extension,
          notes: item.Notes,
          recipient_id: item.ReportsTo,
        })),
    );

    await this.repos.orders.createMany(data.orders.map((item) => ({
      id: item.OrderID,
      order_date: new Date(item.OrderDate),
      required_date: new Date(item.RequiredDate),
      shipped_date: new Date(item.ShippedDate),
      ship_via: item.ShipVia,
      freight: item.Freight,
      ship_name: item.ShipName,
      ship_city: item.ShipCity,
      ship_region: item.ShipRegion,
      ship_postal_code: item.ShipPostalCode,
      ship_country: item.ShipCountry,
      customer_id: item.CustomerID,
      employee_id: item.EmployeeID,
    })));

    await this.repos.suppliers.createMany(data.suppliers.map((item) => ({
      id: item.SupplierID,
      company_name: item.CompanyName,
      contact_name: item.ContactName,
      contact_title: item.ContactTitle,
      address: item.Address,
      city: item.City,
      region: item.Region,
      postal_code: item.PostalCode,
      country: item.Country,
      phone: item.Phone,
    })));

    await this.repos.products.createMany(data.products.map((item) => ({
      id: item.ProductID,
      name: item.ProductName,
      qt_per_unit: item.QuantityPerUnit,
      unit_price: item.UnitPrice,
      units_in_stock: item.UnitsInStock,
      units_on_order: item.UnitsOnOrder,
      reorder_level: item.ReorderLevel,
      discontinued: item.Discontinued,
      supplier_id: item.SupplierID,
    })));

    await this.repos.details.createMany(data.orderDetails.map((item) => ({
      unit_price: item.UnitPrice,
      quantity: item.Quantity,
      discount: item.Discount,
      order_id: item.OrderID,
      product_id: item.ProductID,
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
      map.get(QueryTypes.SELECT) || 0,
      map.get(QueryTypes.SELECT_WHERE) || 0,
      map.get(QueryTypes.SELECT_LEFT_JOIN) || 0,
      map.get(QueryTypes.SELECT_LEFT_JOIN_WHERE) || 0,
      metrics.map((item) => new MetricItem(item.query, item.ms, item.created_at)),
    );
    return info;
  }
}

export default AdminService;
