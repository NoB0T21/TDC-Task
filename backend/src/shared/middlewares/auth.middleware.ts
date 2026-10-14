import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { redis } from '../config/redis';
import { sendError } from '../utils/response.util';
import type { JwtPayload } from '../../types';

declare global {
  namespace Express {
    interface Request {
      matchmaker?: JwtPayload;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 401);
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const isBlacklisted = await redis.get(`blacklist:${token}`);
      if (isBlacklisted) {
        sendError(res, 'Token has been invalidated', 401);
        return;
      }
    } catch (redisErr) {
      console.warn('Redis blacklist check error, continuing:', redisErr);
    }

    const payload = verifyToken(token);
    req.matchmaker = payload;
    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', 401);
  }
}
