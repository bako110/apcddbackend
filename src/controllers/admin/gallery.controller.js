import { Gallery } from '../../models/Gallery.model.js';
import { createCrudController } from './crudFactory.js';

export const {
  list: listGalleryItems,
  getById: getGalleryItemById,
  create: createGalleryItem,
  update: updateGalleryItem,
  remove: removeGalleryItem,
} = createCrudController(Gallery, { notFoundMessage: "Élément de galerie introuvable" });
