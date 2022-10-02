export interface Employee {
    EmployeeID: string;
    LastName: string;
    FirstName: string;
    Title: string;
    TitleOfCourtesy: string;
    BirthDate: Date;
    HireDate: Date;
    Address: string;
    City: string;
    PostalCode: string;
    Country: string;
    HomePhone: string;
    Extension: number;
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
    PostalCode: string;
    Region: string;
    Country: string;
    Phone: string;
    Fax: string;
}

export interface OrderDetail {
    OrderID: string;
    ProductID: string;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
}

export interface Order {
    OrderID: string;
    CustomerID: string;
    EmployeeID: string;
    OrderDate: Date;
    RequiredDate: Date;
    ShippedDate: Date;
    ShipVia: number;
    Freight: number;
    ShipName: string;
    ShipCity: string;
    ShipRegion: string;
    ShipPostalCode: string;
    ShipCountry: string;
}

export interface Product {
    ProductID: string;
    ProductName: string;
    SupplierID: string;
    QuantityPerUnit: string;
    UnitPrice: number;
    UnitsInStock: number;
    UnitsOnOrder: number;
    ReorderLevel: number;
    Discontinued: number;
}

export interface Supplier {
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
}

export interface ICSVReader {
    readCSV<T>(fileName: string): Promise<T[]>;
    readAllCSVs(): Promise<{
        employees: Employee[];
        customers: Customer[];
        orders: Order[];
        suppliers: Supplier[];
        products: Product[];
        orderDetails: OrderDetail[];
    }>;
}

export const FILE_PATH = '../data_tables/';

export enum Files {
    Customers = 'Customers.csv',
    Employees = 'Employees.csv',
    Orders = 'Orders.csv',
    Suppliers = 'Suppliers.csv',
    Products = 'Products.csv',
    OrderDetails = 'OrderDetails.csv',
}
