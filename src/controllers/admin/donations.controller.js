import { Donation } from '../../models/Donation.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const listDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().sort({ createdAt: -1 }).lean();
  sendSuccess(res, donations);
});

export const getDonationById = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).lean();
  if (!donation) {
    sendError(res, 'Don introuvable', 404);
    return;
  }
  sendSuccess(res, donation);
});
