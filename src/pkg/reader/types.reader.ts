export interface Employee {
    EmployeeID: string;
    LastName: string;
    FirstName: string;
    Title: string;
    TitleOfCourtesy: string;
    BirthDate: string;
    HireDate: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    HomePhone: string;
    Extension: string;
    Notes: string;
    ReportsTo: string;
}

export interface Customer {
    CustomerID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
}

export interface OrderDetail {
    OrderID: string;
    ProductID: string;
    UnitPrice: string;
    Quantity: string;
    Discount: string;
}

export interface Order {
    OrderID: string;
    CustomerID: string;
    EmployeeID: string;
    OrderDate: string;
    RequiredDate: string;
    ShippedDate: string;
    ShipVia: string;
    Freight: string;
    ShipName: string;
    ShipAddress: string;
    ShipCity: string;
    ShipRegion: string;
    ShipPostalCode: string;
    ShipCountry: string;
}

export interface Product {
    ProductID: string;
    ProductName: string;
    SupplierID: string;
    CategoryID: string;
    QuantityPerUnit: string;
    UnitPrice: string;
    UnitsInStock: string;
    UnitsOnOrder: string;
    ReorderLevel: string;
    Discontinued: string;
}

export interface Supply {
    SupplierID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
    HomePage: string;
}

export const FILE_PATH = '../data_tables/';

export enum Files {
    Customers = 'Customers.csv',
    Employees = 'Employees.csv',
    Orders = 'Orders.csv',
    Supplies = 'Supplies.csv',
    Products = 'Products.csv',
    OrderDetails = 'OrderDetails.csv',
}
