import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  if (!res.headersSent) {
    res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
    });
  }
};
