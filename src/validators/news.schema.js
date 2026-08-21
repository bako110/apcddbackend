import { z } from 'zod';

// Saisie libre côté admin (cohérent avec News.model.js) : les données réelles
// en production utilisent des libellés français non contraints (ex.
// "environnement", qui ne fait même pas partie de NEWS_CATEGORY_VALUES qui
// ne connaît que "environment" en anglais) ; un enum strict rejetterait donc
// des catégories valides existantes.
export const newsSchema = z.object({
  title: z.string().trim().min(2, 'validation.title.min'),
  summary: z.string().trim().min(2, 'validation.summary.min'),
  content: z.string().trim().min(2, 'validation.content.min'),
  date: z.coerce.date().optional(),
  category: z.string().trim().min(1, 'validation.category.invalid'),
  image: z.string().trim().optional().default(''),
  featured: z.boolean().optional().default(false),
});

export const newsUpdateSchema = newsSchema.partial();
