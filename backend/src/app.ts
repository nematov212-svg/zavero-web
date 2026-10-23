import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, flutter)
      if (!origin) return callback(null, true);
      // In development or if in allowed list
      return callback(null, true);
    },
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Basic request logger in dev
  if (ENV.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Zavero Backend API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API routes
  app.use('/api', routes);

  // 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint topilmadi: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
