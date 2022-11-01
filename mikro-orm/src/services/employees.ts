import { EntityManager, LoadStrategy } from '@mikro-orm/core';
import { Employee } from '@/entities/employees';
import { ApiError } from '@/error';

export class EmployeesService {
  constructor(private readonly em: EntityManager) {
    this.em = em;
  }

  async getAll() {
    const data = await this.em.find(Employee, {});
    const employees = data.map((item) => ({
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      title: item.title,
      city: item.city,
      homePhone: item.homePhone,
      country: item.country,
    }));
    return employees;
  }

  async getInfo(id: string) {
    const data = await this.em.findOne(
      Employee,
      { id },
      {
        populate: ['recipient'],
      },
    );
    if (!data) throw ApiError.badRequest('Unknown employee!');
    console.log(data);
    const { recipient } = data;
    const employee = ({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      titleOfCourtesy: data.titleOfCourtesy,
      bithDate: data.birthDate,
      hireDate: data.hireDate,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
      homePhone: data.homePhone,
      extension: data.extension,
      notes: data.notes,
      recipient: recipient ? {
        id: recipient.id,
        firstName: recipient.firstName,
        lastName: recipient.lastName,
      } : null,
    });
    return employee;
  }
}
