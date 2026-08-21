import { Member } from '../../models/Member.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const listMembers = asyncHandler(async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 }).lean();
  sendSuccess(res, members);
});

export const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id).lean();
  if (!member) {
    sendError(res, 'Membre introuvable', 404);
    return;
  }
  sendSuccess(res, member);
});

export const updateMemberStatus = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).lean();

  if (!member) {
    sendError(res, 'Membre introuvable', 404);
    return;
  }
  sendSuccess(res, member);
});
