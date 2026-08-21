import { Partner } from '../models/Partner.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getPartners = asyncHandler(async (req, res) => {
  const partners = await Partner.find().lean();
  sendSuccess(res, partners);
});
