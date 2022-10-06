export class EmployeeItem {
  id: string;
  firstName: string | null;
  lastName: string;
  title: string;
  city: string | null;
  phone: string;
  country: string;

  constructor(
    id: string,
    firstName: string | null,
    lastName: string,
    title: string,
    city: string | null,
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
  id: string | null;
  firstName: string | null;
  lastName: string | null;

  constructor(
    id: string | null,
    firstName: string | null,
    lastName: string | null,
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
  address: string | null;
  city: string | null;
  postalCode: string;
  country: string;
  homePhone: string;
  extension: number;
  notes: string;
  reportsTo: EmployeeRecipient | null;

  constructor(
    id: string,
    firstName: string | null,
    lastName: string,
    title: string,
    titleOfCourtesy: string,
    birthDate: Date,
    hireDate: Date,
    address: string | null,
    city: string | null,
    postalCode: string,
    country: string,
    homePhone: string,
    extension: number,
    notes: string,
    reportsTo: EmployeeRecipient | null,
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
