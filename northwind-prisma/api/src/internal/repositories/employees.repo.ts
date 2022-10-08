import { Employee, PrismaClient } from '@prisma/client';
import { IEmployeesRepo } from './repositories';
import { EmployeeJoinRecipient } from './types/employees';

class EmployeesRepo implements IEmployeesRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Employee[]> {
    const data = await this.prisma.employee.findMany();

    return data;
  }

  async getInfo(id: string): Promise<EmployeeJoinRecipient | null> {
    const data = await this.prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        recipient: true,
      },
    });

    return data;
  }

  async createMany(employees: Employee[]): Promise<void> {
    await this.prisma.employee.createMany({
      data: employees,
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.employee.deleteMany();
  }
}

export default EmployeesRepo;
