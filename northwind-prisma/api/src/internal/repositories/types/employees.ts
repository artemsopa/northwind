import { Employee } from '@prisma/client';

export type EmployeeJoinRecipient = Employee & {
    recipient: Employee | null;
}
