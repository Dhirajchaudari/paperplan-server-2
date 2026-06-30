import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './modules/auth/routes/auth.routes';
import tasksRoutes from './modules/tasks/routes/tasks.routes';
import db from './db/connection';

const app = express();

// Trust reverse proxy (Nginx) to read client's real IP in X-Forwarded-For header
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());

if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Define health check endpoint BEFORE rate limiting so uptime monitors aren't blocked
app.get('/health', (_req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

if (env.NODE_ENV !== 'test') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later', statusCode: 429 },
  });
  app.use(limiter);
}

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

app.use(errorMiddleware);

export default app;
