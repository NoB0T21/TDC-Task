import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import customersRoutes from './modules/customers/customers.routes';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { apiRateLimiter } from './shared/middlewares/rateLimiter.middleware';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Base Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// General Rate Limiter on API routes
app.use('/api', apiRateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Modules
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);

// Centralized Error Middleware (must be after all routes)
app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
