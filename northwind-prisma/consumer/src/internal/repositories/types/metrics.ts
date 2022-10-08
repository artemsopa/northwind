import { Metric } from '@prisma/client';

export type MetricInput = Omit<Metric, 'id' | 'createdAt'>;
