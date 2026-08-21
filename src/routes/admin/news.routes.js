import { Router } from 'express';
import {
  listNews,
  getNewsById,
  createNews,
  updateNews,
  removeNews,
} from '../../controllers/admin/news.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { newsSchema, newsUpdateSchema } from '../../validators/news.schema.js';

const router = Router();

router.get('/', listNews);
router.get('/:id', getNewsById);
router.post('/', validateRequest(newsSchema), createNews);
router.put('/:id', validateRequest(newsUpdateSchema), updateNews);
router.delete('/:id', removeNews);

export default router;
