export class CustomerItem {
  id: string;
  company: string;
  contact: string;
  title: string;
  city: string;
  country: string;

  constructor(
    id: string,
    company: string,
    contact: string,
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

export class CustomerInfo {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  address: string;
  city: string;
  postalCode: string | null;
  region: string | null;
  country: string;
  phone: string;
  fax: string | null;

  constructor(
    id: string,
    companyName: string,
    contactName: string,
    contactTitle: string,
    address: string,
    city: string,
    postalCode: string | null,
    region: string | null,
    country: string,
    phone: string,
    fax: string | null,
  ) {
    this.id = id;
    this.companyName = companyName;
    this.contactName = contactName;
    this.contactTitle = contactTitle;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.region = region;
    this.country = country;
    this.phone = phone;
    this.fax = fax;
  }
}
