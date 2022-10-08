export class EnqueuedMetric {
  query: string;
  ms: number;
  date: Date;
  constructor(
    query: string,
    ms: number,
    date: Date,
  ) {
    this.query = query;
    this.ms = ms;
    this.date = date;
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
