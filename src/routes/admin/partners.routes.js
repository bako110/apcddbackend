import { Router } from 'express';
import {
  listPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  removePartner,
} from '../../controllers/admin/partners.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { partnerSchema, partnerUpdateSchema } from '../../validators/partner.schema.js';

const router = Router();

router.get('/', listPartners);
router.get('/:id', getPartnerById);
router.post('/', validateRequest(partnerSchema), createPartner);
router.put('/:id', validateRequest(partnerUpdateSchema), updatePartner);
router.delete('/:id', removePartner);

export default router;
