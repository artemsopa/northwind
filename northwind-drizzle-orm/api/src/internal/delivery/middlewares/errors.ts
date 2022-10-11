import { ErrorRequestHandler } from 'express';
import { ErrorApi } from '@/pkg/error';

const errors: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ErrorApi) {
    return res.status(error.status).json({
      message: error.message,
    });
  }
  return res.status(500).json({ message: 'Internal server error!' });
};

export default errors;
