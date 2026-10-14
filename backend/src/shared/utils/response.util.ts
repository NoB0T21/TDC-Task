import type { Response } from 'express';
import type { ApiResponse } from '../../types';

export function sendSuccess<T>(res: Response, data: T, message = 'Success', status = 200): void {
  const response: ApiResponse<T> = { success: true, message, data };
  res.status(status).json(response);
}

export function sendError(res: Response, message: string, status = 400): void {
  const response: ApiResponse = { success: false, message, error: message };
  res.status(status).json(response);
}
