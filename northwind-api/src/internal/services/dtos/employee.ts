export class EmployeeItem {
  id: string;
  firstName: string | null;
  lastName: string;
  title: string;
  city: string;
  phone: string;
  country: string;

  constructor(
    id: string,
    firstName: string | null,
    lastName: string,
    title: string,
    city: string,
    phone: string,
    country: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.title = title;
    this.city = city;
    this.phone = phone;
    this.country = country;
  }
}

export class EmployeeRecipient {
  id: string;
  firstName: string | null;
  lastName: string;

  constructor(
    id: string,
    firstName: string | null,
    lastName: string,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export class EmployeeInfo {
  id: string;
  firstName: string | null;
  lastName: string;
  title: string;
  titleOfCourtesy: string;
  birthDate: Date;
  hireDate: Date;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  homePhone: string;
  extension: number;
  notes: string;
  reportsTo: EmployeeRecipient;

  constructor(
    id: string,
    firstName: string | null,
    lastName: string,
    title: string,
    titleOfCourtesy: string,
    birthDate: Date,
    hireDate: Date,
    address: string,
    city: string,
    postalCode: string,
    country: string,
    homePhone: string,
    extension: number,
    notes: string,
    reportsTo: EmployeeRecipient,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.title = title;
    this.titleOfCourtesy = titleOfCourtesy;
    this.birthDate = birthDate;
    this.hireDate = hireDate;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
    this.homePhone = homePhone;
    this.extension = extension;
    this.notes = notes;
    this.reportsTo = reportsTo;
  }
}
