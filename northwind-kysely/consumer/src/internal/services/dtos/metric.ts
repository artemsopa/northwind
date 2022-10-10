import { QueryTypes } from '../../repositories/types/types';

export class EnqueuedMetric {
  query: string;
  ms: number;
  type: QueryTypes;
  constructor(
    query: string,
    ms: number,
    type: QueryTypes,
  ) {
    this.query = query;
    this.ms = ms;
    this.type = type;
  }
}

export class DequeuedMessage {
  id: string;
  receiptHandle: string;
  metric: EnqueuedMetric;
  constructor(
    id: string,
    receiptHandle: string,
    metric: EnqueuedMetric,
  ) {
    this.id = id;
    this.receiptHandle = receiptHandle;
    this.metric = metric;
  }
}
