import { Donation } from '../models/Donation.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createDonation = asyncHandler(async (req, res) => {
  await Donation.create(req.body);
  sendSuccess(res, { message: 'Merci pour votre don !' }, 201);
});
