import { Router } from 'express';
import { memberSchema } from '../shared/schemas.js';
import { createMember } from '../controllers/members.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/', publicWriteLimiter, validateRequest(memberSchema), createMember);

export default router;
