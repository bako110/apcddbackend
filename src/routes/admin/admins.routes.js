import { Router } from 'express';
import {
  listAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  removeAdmin,
} from '../../controllers/admin/admins.controller.js';
import { requireSuperAdmin } from '../../middlewares/requireSuperAdmin.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { adminCreateSchema, adminUpdateSchema } from '../../validators/admin.schema.js';

const router = Router();

router.use(requireSuperAdmin);

router.get('/', listAdmins);
router.get('/:id', getAdminById);
router.post('/', validateRequest(adminCreateSchema), createAdmin);
router.put('/:id', validateRequest(adminUpdateSchema), updateAdmin);
router.delete('/:id', removeAdmin);

export default router;
