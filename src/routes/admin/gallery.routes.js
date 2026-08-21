import { Router } from 'express';
import {
  listGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  removeGalleryItem,
} from '../../controllers/admin/gallery.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { gallerySchema, galleryUpdateSchema } from '../../validators/gallery.schema.js';

const router = Router();

router.get('/', listGalleryItems);
router.get('/:id', getGalleryItemById);
router.post('/', validateRequest(gallerySchema), createGalleryItem);
router.put('/:id', validateRequest(galleryUpdateSchema), updateGalleryItem);
router.delete('/:id', removeGalleryItem);

export default router;
