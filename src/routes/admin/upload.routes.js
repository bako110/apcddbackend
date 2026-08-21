import { Router } from 'express';
import { upload } from '../../middlewares/upload.js';
import { uploadImage } from '../../controllers/admin/upload.controller.js';

const router = Router();

router.post('/', upload.single('file'), uploadImage);

export default router;
