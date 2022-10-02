// eslint-disable-next-line import/no-extraneous-dependencies
import AWS from 'aws-sdk';

export interface ISQSQueue {
  deleteMessages(deleteMessageRequests: any[]): Promise<void>;
}

class SQSQueue {
  private sqsUrl: string;
  constructor(private sqsClient: AWS.SQS, sqsUrl: string) {
    this.sqsClient = sqsClient;
    this.sqsUrl = sqsUrl;
  }

  async deleteMessages(deleteMessageRequests: any[]): Promise<void> {
    if (deleteMessageRequests.length <= 0) {
      return;
    }

    const result = await this.sqsClient
      .deleteMessageBatch({
        QueueUrl: this.sqsUrl,
        Entries: deleteMessageRequests.map((m) => ({
          Id: m.id,
          ReceiptHandle: m.receiptHandle,
        })),
      })
      .promise();

    if (result.Failed.length > 0) {
      throw new Error('Unable to delete messages from the queue.');
    }
  }
}

export default SQSQueue;
