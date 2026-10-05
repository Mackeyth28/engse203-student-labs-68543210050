/**
 * config.js — รวมการอ่าน environment variable ไว้ที่เดียว
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');

const env = process.env.NODE_ENV ?? 'development';
const isProd = env === 'production';
const configuredJwtSecret = process.env.JWT_SECRET;

if (isProd && !configuredJwtSecret) {
  throw new Error(
    'JWT_SECRET ต้องถูกกำหนดเมื่อรันใน production'
  );
}

export const config = {
  env,
  isProd,

  port: Number(process.env.PORT ?? 3001),

  corsOrigin:
    process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  dbFile:
    process.env.DB_FILE ??
    path.join(API_ROOT, 'data', 'campus.db'),

  schemaFile: path.join(
    API_ROOT,
    'data',
    'schema.sql'
  ),

  staticDir:
    process.env.STATIC_DIR ??
    path.join(API_ROOT, '..', 'frontend', 'dist'),

  jwtSecret:
    configuredJwtSecret ||
    'dev-only-secret-do-not-use-in-production',

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN ?? '2h',
};