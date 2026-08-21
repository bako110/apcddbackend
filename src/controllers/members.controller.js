import { Member } from '../models/Member.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createMember = asyncHandler(async (req, res) => {
  await Member.create(req.body);
  sendSuccess(res, { message: 'Inscription réussie !' }, 201);
});
