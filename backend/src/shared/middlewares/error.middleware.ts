import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled error:', err);
  const status = typeof err?.status === 'number' ? err.status : 500;
  const message = err?.message || 'Internal server error';
  sendError(res, message, status);
}
