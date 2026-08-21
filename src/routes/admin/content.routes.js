import { Router } from 'express';
import { getContent, updateContent } from '../../controllers/admin/content.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { contentUpdateSchema } from '../../validators/content.schema.js';

const router = Router();

router.get('/', getContent);
router.put('/', validateRequest(contentUpdateSchema), updateContent);

export default router;
