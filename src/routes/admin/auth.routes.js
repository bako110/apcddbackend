import { Router } from 'express';
import { login } from '../../controllers/admin/auth.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { loginSchema } from '../../validators/auth.schema.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, validateRequest(loginSchema), login);

export default router;
