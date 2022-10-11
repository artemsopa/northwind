import { SQSEvent } from 'aws-lambda';
import { Queue } from './queue';
import { DequeuedMessage, EnqueuedMetric } from './dtos/metric';
import { Database } from './schema';

export class Consumer {
  constructor(private readonly db: Database, private readonly queue: Queue) {
    this.db = db;
    this.queue = queue;
  }

  async handle(event: SQSEvent) {
    const dequeuedMessages = this.mapEventToDequeuedMessages(event);
    const messagesToDelete: DequeuedMessage[] = [];

    const promises = dequeuedMessages.map(async (message) => {
      try {
        await this.db.metrics.insert({
          query: message.metric.query,
          ms: message.metric.ms,
          type: message.metric.type,
        }).execute();
        messagesToDelete.push(message);
      } catch (error) {
        messagesToDelete.push(message);
      }
    });
    await Promise.all(promises);

    const numRetriableMessages = dequeuedMessages.length - messagesToDelete.length;
    if (numRetriableMessages > 0) {
      await this.queue.deleteMessages(messagesToDelete);
      const errorMessage = `Failing due to ${numRetriableMessages} unsuccessful and retriable errors.`;
      throw new Error(errorMessage);
    }
  }

  private mapEventToDequeuedMessages(event: SQSEvent): DequeuedMessage[] {
    return event.Records.map((record) => {
      const metric = JSON.parse(record.body) as EnqueuedMetric;
      return {
        id: record.messageId,
        receiptHandle: record.receiptHandle,
        metric,
      };
    });
  }
}
