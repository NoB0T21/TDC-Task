import rateLimit from 'express-rate-limit';

// Strict limit for auth routes (prevent brute force)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
