import { SQSEvent } from 'aws-lambda';
import { IMetricsService } from '../services/services';
import { ISQSQueue } from '../../pkg/queue/sqs.queue';
import { EnqueuedMetric } from '../services/dtos/metric';

class Consumer {
  constructor(private metricsService: IMetricsService, private queue: ISQSQueue) {
    this.metricsService = metricsService;
    this.queue = queue;
  }

  async handle(sqsEvent: SQSEvent) {
    const dequeuedMessages = this.mapEventToDequeuedMessages(sqsEvent);
    console.log(dequeuedMessages);
    // const messagesToDelete: DequeuedMessage[] = [];

    // const promises = dequeuedMessages.map(async (message) => {
    //   try {
    //     await this.processMessage(message);
    //     messagesToDelete.push(message);
    //   } catch (error) {
    //     if (error instanceof NonRetriableError) {
    //       messagesToDelete.push(message);
    //       this.logService.error(
    //         EventService.name,
    //         'Processing message',
    //         message,
    //         'caused a non retriable error. Error:',
    //         error,
    //       );
    //     } else {
    //       this.logService.error(
    //         EventService.name,
    //         'Processing message',
    //         message,
    //         'caused a retriable error. Error:',
    //         error,
    //       );
    //     }
    //   }
    // });
    // await until all messages have been processed
    // await Promise.all(promises);

    // Delete successful messages manually if other processings failed
    // const numRetriableMessages = dequeuedMessages.length - messagesToDelete.length;
    // if (numRetriableMessages > 0) {
    //   await this.queueService.deleteMessages(messagesToDelete);

    //   const errorMessage = `Failing due to ${numRetriableMessages} unsuccessful and retriable errors.`;

    //   throw new PartialFailureError(errorMessage);
    // }
  }

  private mapEventToDequeuedMessages(event: SQSEvent) {
    return event.Records.map((record) => {
      const message = JSON.parse(record.body) as EnqueuedMetric;
      return {
        id: record.messageId,
        receiptHandle: record.receiptHandle,
        ...message,
      };
    });
  }
}

export default Consumer;
