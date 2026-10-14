import type { Request, Response } from 'express';
import { z } from 'zod';
import { loginService, logoutService, getMeService } from './auth.service';
import { sendSuccess, sendError } from '../../shared/utils/response.util';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues?.[0]?.message || 'Validation error';
    sendError(res, msg, 422);
    return;
  }

  const { email, password } = parsed.data;
  const result = await loginService(email, password);

  if (!result) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  sendSuccess(res, result, 'Login successful');
}

export async function logout(req: Request, res: Response): Promise<void> {
  const token = req.headers.authorization!.split(' ')[1];
  await logoutService(token, req.matchmaker!.matchmakerId);
  sendSuccess(res, null, 'Logged out successfully');
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const me = await getMeService(req.matchmaker!.matchmakerId);
  if (!me) {
    sendError(res, 'Matchmaker not found', 404);
    return;
  }
  sendSuccess(res, me, 'Profile fetched');
}
