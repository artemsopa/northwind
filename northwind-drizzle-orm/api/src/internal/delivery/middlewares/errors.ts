import { NextFunction, Request, Response } from 'express';
import { ErrorApi } from '../../../pkg/error';

const errors = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  if (error instanceof ErrorApi) {
    return res.status(error.status).json({
      message: error.message,
    });
  }
  return res.status(500).json({ message: 'Internal server error!' });
};

export default errors;
