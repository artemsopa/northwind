import dotenv from 'dotenv';

const initConfigs = () => {
  dotenv.config();
  const {
    PORT,
    CSV_DIR,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    AWS_SQS_URL,
  } = process.env;

  if (!PORT
    || !CSV_DIR
    || !AWS_ACCESS_KEY
    || !AWS_SECRET_KEY
    || !AWS_REGION
    || !AWS_SQS_URL) {
    throw new Error('ERROR! Invalid configuration');
  }

  return {
    app: {
      PORT,
    },
    csv: {
      CSV_DIR,
    },
    aws: {
      AWS_ACCESS_KEY,
      AWS_SECRET_KEY,
      AWS_REGION,
      sqs: {
        AWS_SQS_URL,
      },
    },
  };
};

export default initConfigs;
