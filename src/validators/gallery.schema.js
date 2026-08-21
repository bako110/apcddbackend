import { z } from 'zod';

// Saisie libre côté admin (cohérent avec Gallery.model.js) : les données
// réelles en production ne sont pas limitées aux 3 valeurs de
// GALLERY_CATEGORY_VALUES ("festivals", "environment", "community"), un
// enum strict rejetterait donc des catégories valides existantes.
export const gallerySchema = z.object({
  title: z.string().trim().min(2, 'validation.title.min'),
  description: z.string().trim().optional().default(''),
  category: z.string().trim().min(1, 'validation.category.invalid'),
  imageUrl: z.string().trim().min(1, 'validation.imageUrl.required'),
});

export const galleryUpdateSchema = gallerySchema.partial();
