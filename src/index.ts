import { APIGatewayEvent, Context, SQSEvent } from 'aws-lambda';
import serverless from 'serverless-http';
import app from './app/app';

export const handler = async (event: APIGatewayEvent, context: Context) => serverless((await app).handler)(event, context);

export const consumer = async (event: SQSEvent) => (await app).consumer.handle(event);
