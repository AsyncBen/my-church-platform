import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import {
  submitGiving,
  getMyGivings,
  getAllGivingsController,
  getSummary,
} from './giving.controller';

const router = Router();

// POST / → authenticate, submitGiving
router.post('/', authenticate, submitGiving);

// GET /my → authenticate, getMyGivings
router.get('/my', authenticate, getMyGivings);

// GET /summary → authenticate, authorize, getSummary
router.get(
  '/summary',
  authenticate,
  authorize(['SECRETARY', 'PASTOR', 'ADMIN']),
  getSummary
);

// GET / → authenticate, authorize, getAllGivings (must be after /my and /summary to avoid conflicts)
router.get(
  '/',
  authenticate,
  authorize(['SECRETARY', 'PASTOR', 'ADMIN']),
  getAllGivingsController
);

export default router;
