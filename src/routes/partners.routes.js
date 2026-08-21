import { Router } from 'express';
import { getPartners } from '../controllers/partners.controller.js';

const router = Router();

router.get('/', getPartners);

export default router;
