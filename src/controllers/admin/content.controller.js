import { Content } from '../../models/Content.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

// Content est un singleton : la collection "contents" en production ne
// contient qu'un seul document, sans champ discriminant. Un filtre `{}`
// cible donc toujours ce même document existant (upsert ne crée un nouveau
// document que si la collection est réellement vide, ce qui préserve les
// vraies données au lieu de les dupliquer).
export const getContent = asyncHandler(async (req, res) => {
  const content = await Content.findOneAndUpdate(
    {},
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  sendSuccess(res, content);
});

export const updateContent = asyncHandler(async (req, res) => {
  const content = await Content.findOneAndUpdate(
    {},
    { $set: req.body },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
  sendSuccess(res, content);
});
