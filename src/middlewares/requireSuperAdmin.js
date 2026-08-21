import { sendError } from '../utils/apiResponse.js';

export function requireSuperAdmin(req, res, next) {
  if (req.admin?.role !== 'superadmin') {
    sendError(res, 'Réservé aux administrateurs principaux', 403);
    return;
  }
  next();
}
