import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { existsSync } from 'node:fs';

import { config } from './config.js';

import requestRoutes from './routes/requestRoutes.js';
import userRoutes from './routes/userRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

import {
  errorHandler,
  notFound,
} from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // CORS
  app.use(
    cors({
      origin: config.corsOrigin,
    })
  );

  // Logging แยกตาม Environment
  app.use(
    morgan(
      config.isProd
        ? 'combined'
        : 'dev'
    )
  );

  // JSON Body
  app.use(express.json());

  // API information
  app.get('/api', (req, res) => {
    return res.status(200).json({
      message:
        'Campus Service API is running',
      version: '3.0.0',
    });
  });

  // API Routes
  app.use(
    '/api/health',
    healthRoutes
  );

  app.use(
    '/api/requests',
    requestRoutes
  );

  app.use(
    '/api/users',
    userRoutes
  );

  // Production: เสิร์ฟ React Build
  if (
    config.isProd &&
    existsSync(config.staticDir)
  ) {
    app.use(
      express.static(
        config.staticDir
      )
    );

    // React Router Fallback
    // ทุก Route ที่ไม่ขึ้นต้นด้วย /api
    // จะได้รับ index.html
    app.get(
      /^\/(?!api).*/,
      (req, res) => {
        return res.sendFile(
          path.join(
            config.staticDir,
            'index.html'
          )
        );
      }
    );
  } else {
    // Development: Frontend รันที่ Vite
    app.get('/', (req, res) => {
      return res
        .status(200)
        .json({
          message:
            'API (dev) — หน้าเว็บอยู่ที่พอร์ต 5173',
        });
    });
  }

  // Error Middleware ต้องอยู่ท้ายสุด
  app.use(notFound);
  app.use(errorHandler);

  return app;
}