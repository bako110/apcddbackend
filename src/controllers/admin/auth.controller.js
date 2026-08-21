import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { Admin } from '../../models/Admin.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    sendError(res, 'Identifiants invalides', 401);
    return;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    sendError(res, 'Identifiants invalides', 401);
    return;
  }

  const token = jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: admin.role || 'manager' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );

  sendSuccess(res, { token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
});
