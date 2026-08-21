import { Router } from 'express';
import { getDashboard } from '../../controllers/admin/dashboard.controller.js';

const router = Router();

router.get('/', getDashboard);

export default router;
