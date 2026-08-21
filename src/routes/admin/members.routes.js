import { Router } from 'express';
import {
  listMembers,
  getMemberById,
  updateMemberStatus,
} from '../../controllers/admin/members.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { memberStatusSchema } from '../../validators/memberStatus.schema.js';

const router = Router();

router.get('/', listMembers);
router.get('/:id', getMemberById);
router.patch('/:id/status', validateRequest(memberStatusSchema), updateMemberStatus);

export default router;
