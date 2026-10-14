import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-min-32-chars-long';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as any;

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
