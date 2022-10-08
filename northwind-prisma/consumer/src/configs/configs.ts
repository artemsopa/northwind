import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    AWS_SQS_URL,
  } = process.env;

  if (!AWS_SQS_URL) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    aws: {
      sqs: {
        AWS_SQS_URL,
      },
    },
  };
};

export default initConfigs;
