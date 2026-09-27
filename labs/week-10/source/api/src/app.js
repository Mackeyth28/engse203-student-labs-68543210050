import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config.js';
import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';

import {
  errorHandler,
  notFound,
} from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // ① CORS ต้องมาก่อน Route
  app.use(
    cors({
      origin: config.corsOrigin,
    })
  );

  // ② Logging
  app.use(
    morgan(
      config.isProduction
        ? 'combined'
        : 'dev'
    )
  );

  // ③ อ่าน JSON Body
  app.use(express.json());

  // ④ Root Route
  app.get('/', (req, res) => {
    return res.status(200).json({
      message: 'Campus Service API is running',
      version: '2.0.0',
    });
  });

  // ⑤ API Routes
  app.use('/api/requests', requestRoutes);
  app.use('/api/users', userRoutes);

  // ⑥ ต้องอยู่ท้ายสุดเสมอ
  app.use(notFound);
  app.use(errorHandler);

  return app;
}