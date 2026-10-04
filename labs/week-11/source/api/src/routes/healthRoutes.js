import { Router } from 'express';

import { config } from '../config.js';

import {
  getDbStatus,
} from '../services/requestService.js';

const router = Router();

router.get('/', (req, res) => {
  const database = getDbStatus();
  const ok = database.connected;

  return res
    .status(ok ? 200 : 503)
    .json({
      status: ok
        ? 'ok'
        : 'degraded',

      env: config.env,

      uptime: Math.round(
        process.uptime()
      ),

      database,

      time: new Date().toISOString(),
    });
});

export default router;