import { Content } from '../models/Content.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getContent = asyncHandler(async (req, res) => {
  // Singleton : un seul document existe dans la collection "contents" en
  // production, et il n'a pas de champ discriminant ("key"). On récupère
  // simplement le premier (et normalement unique) document.
  const content = await Content.findOne({}).lean();

  if (!content) {
    sendError(res, 'Contenu introuvable', 404);
    return;
  }

  sendSuccess(res, {
    about: content.about,
    stats: content.stats,
  });
});
