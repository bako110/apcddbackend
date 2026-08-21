import { News } from '../models/News.model.js';

/**
 * Incrémente le compteur de vues d'une actualité et retourne le document mis à jour.
 */
export async function incrementNewsViews(newsId) {
  return News.findByIdAndUpdate(newsId, { $inc: { views: 1 } }, { new: true });
}
