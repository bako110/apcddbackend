import { News } from '../models/News.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { incrementNewsViews } from '../services/news.service.js';

export const getNews = asyncHandler(async (req, res) => {
  const news = await News.find().sort({ date: -1 }).lean();
  sendSuccess(res, news);
});

export const getNewsById = asyncHandler(async (req, res) => {
  const updated = await incrementNewsViews(req.params.id);

  if (!updated) {
    sendError(res, 'Actualité introuvable', 404);
    return;
  }

  sendSuccess(res, updated);
});
