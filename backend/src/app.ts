import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import customersRoutes from './modules/customers/customers.routes';
import matchingRoutes from './modules/matching/matching.routes';
import aiRoutes from './modules/ai/ai.routes';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { apiRateLimiter } from './shared/middlewares/rateLimiter.middleware';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = rawFrontendUrl
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools with no origin header (like curl or postman)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, '');
      const isAllowed =
        allowedOrigins.includes(cleanOrigin) ||
        (process.env.NODE_ENV !== 'production' &&
          (cleanOrigin.startsWith('http://localhost:') || cleanOrigin.startsWith('http://127.0.0.1:')));

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api', apiRateLimiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Primary API routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/ai', aiRoutes);

// Route aliases without /api prefix
app.use('/auth', authRoutes);
app.use('/customers', customersRoutes);
app.use('/matching', matchingRoutes);
app.use('/ai', aiRoutes);

app.use(errorMiddleware);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
