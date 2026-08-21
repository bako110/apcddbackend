import { Router } from 'express';
import { getNews, getNewsById } from '../controllers/news.controller.js';

const router = Router();

router.get('/', getNews);
router.get('/:id', getNewsById);

export default router;
