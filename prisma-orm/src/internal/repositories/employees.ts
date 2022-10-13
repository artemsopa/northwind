import { PrismaClient } from '@prisma/client';
import { EmployeeJoinRecipient } from '@/internal/repositories/types/types';

export class EmployeesRepo {
  constructor(private readonly prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    const data = await this.prisma.employee.findMany();

    return data;
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

    return data as EmployeeJoinRecipient;
  }
}
