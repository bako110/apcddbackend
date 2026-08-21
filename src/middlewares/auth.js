import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.js';

export function requireAdminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    sendError(res, 'Authentification requise', 401);
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    sendError(res, 'Token invalide ou expiré', 401);
  }
}
