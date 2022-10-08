import { NextFunction, Request, Response } from 'express';
import ApiError from '../../../pkg/error/api.error';

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      message: error.message,
      errors: error.errors,
    });
  }
  return res.status(500).json({ message: 'Internal server error!' });
};

export default errorMiddleware;
