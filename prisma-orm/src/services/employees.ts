import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/error';

export class EmployeesService {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.employee.findMany();

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
    const data = await this.prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        recipient: true,
      },
    });

    if (!data) throw ApiError.badRequest('Unknown employee!');

    const recipient = data.recipient ? ({
      id: data.recipient.id,
      firstName: data.recipient.firstName,
      lastName: data.recipient.lastName,
    }) : null;

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
      recipient,
    });
    return employee;
  }
}
