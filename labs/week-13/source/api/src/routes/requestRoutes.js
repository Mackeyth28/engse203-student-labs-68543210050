import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  authenticate,
  requireRole,
} from '../middleware/auth.js';

const router = Router();

// GET และ POST เปิดให้ทุกคนใช้งานได้
router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);

// PUT และ DELETE ใช้ได้เฉพาะเจ้าหน้าที่ที่มี token
router.put(
  '/:id',
  authenticate,
  requireRole('staff'),
  controller.updateRequestStatus
);

router.delete(
  '/:id',
  authenticate,
  requireRole('staff'),
  controller.deleteRequest
);

export default router;