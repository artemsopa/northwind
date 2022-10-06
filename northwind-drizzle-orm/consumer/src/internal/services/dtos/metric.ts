import { QType } from '../../repositories/entities/schema';

export class EnqueuedMetric {
  query: string;
  ms: number;
  type: QType;
  constructor(
    query: string,
    ms: number,
    type: QType,
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
