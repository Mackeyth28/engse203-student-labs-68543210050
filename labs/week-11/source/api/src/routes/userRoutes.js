import { Router } from 'express';
import {
  listUsers,
} from '../controllers/requestController.js';

const router = Router();

router.get('/', listUsers);

export default router;