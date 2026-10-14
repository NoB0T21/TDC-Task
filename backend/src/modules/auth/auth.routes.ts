import { Router } from 'express';
import { login, logout, getMe } from './auth.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { authRateLimiter } from '../../shared/middlewares/rateLimiter.middleware';

const router = Router();

router.post('/login', authRateLimiter, login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;
