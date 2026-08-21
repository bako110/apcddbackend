import { Router } from 'express';
import { donationSchema } from '../shared/schemas.js';
import { createDonation } from '../controllers/donations.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { publicWriteLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/', publicWriteLimiter, validateRequest(donationSchema), createDonation);

export default router;
