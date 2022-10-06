import { SQSEvent } from 'aws-lambda';
import { IConsumerService } from '../services/services';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { DequeuedMessage, EnqueuedMetric } from '../services/dtos/metric';
import { IMetricsRepo } from '../repositories/repositories';

class ConsumerService implements IConsumerService {
  constructor(private readonly metricsRepo: IMetricsRepo, private readonly queue: ISQSQueue) {
    this.metricsRepo = metricsRepo;
    this.queue = queue;
  }

  async handle(event: SQSEvent) {
    const dequeuedMessages = this.mapEventToDequeuedMessages(event);
    const messagesToDelete: DequeuedMessage[] = [];

    const promises = dequeuedMessages.map(async (message) => {
      try {
        await this.metricsRepo.create(message.metric.query, message.metric.ms, message.metric.type);
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
      return new DequeuedMessage(
        record.messageId,
        record.receiptHandle,
        metric,
      );
    });
  }
}

export default ConsumerService;
