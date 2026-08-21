import { Router } from 'express';
import { listDonations, getDonationById } from '../../controllers/admin/donations.controller.js';

const router = Router();

router.get('/', listDonations);
router.get('/:id', getDonationById);

export default router;
