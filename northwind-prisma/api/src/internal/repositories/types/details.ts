import { Detail } from '@prisma/client';

export type DetailInput = Omit<Detail, 'id'>;
