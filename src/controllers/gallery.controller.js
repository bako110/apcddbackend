import { Gallery } from '../models/Gallery.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getGallery = asyncHandler(async (req, res) => {
  const items = await Gallery.find().sort({ createdAt: -1 }).lean();
  sendSuccess(res, items);
});
