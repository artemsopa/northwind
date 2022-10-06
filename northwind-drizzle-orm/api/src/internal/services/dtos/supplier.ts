export class SupplierItem {
  id: string;
  company: string;
  contact: string | null;
  title: string;
  city: string;
  country: string;
  constructor(
    id: string,
    company: string,
    contact: string | null,
    title: string,
    city: string,
    country: string,
  ) {
    this.id = id;
    this.company = company;
    this.contact = contact;
    this.title = title;
    this.city = city;
    this.country = country;
  }
}

export class SupplierInfo {
  id: string;
  companyName: string;
  contactName: string | null;
  contactTitle: string;
  address: string;
  city: string;
  region: string | null;
  postalCode: string;
  country: string;
  phone: string;
  constructor(
    id: string,
    companyName: string,
    contactName: string | null,
    contactTitle: string,
    address: string,
    city: string,
    region: string | null,
    postalCode: string,
    country: string,
    phone: string,
  ) {
    this.id = id;
    this.companyName = companyName;
    this.contactName = contactName;
    this.contactTitle = contactTitle;
    this.address = address;
    this.city = city;
    this.region = region;
    this.postalCode = postalCode;
    this.country = country;
    this.phone = phone;
  }
}
