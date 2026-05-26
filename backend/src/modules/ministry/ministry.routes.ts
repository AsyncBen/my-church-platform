import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  getAllGroups,
  getUserGroups,
  joinGroup,
  leaveGroup,
  getGroupMessages,
  sendMessage,
} from './ministry.controller';

const router = Router();

// GET /api/ministry
router.get('/', authenticate, getAllGroups);

// GET /api/ministry/my
router.get('/my', authenticate, getUserGroups);

// POST /api/ministry/:groupId/join
router.post('/:groupId/join', authenticate, joinGroup);

// DELETE /api/ministry/:groupId/leave
router.delete('/:groupId/leave', authenticate, leaveGroup);

// GET /api/ministry/:groupId/messages
router.get('/:groupId/messages', authenticate, getGroupMessages);

// POST /api/ministry/:groupId/messages
router.post('/:groupId/messages', authenticate, sendMessage);

export default router;