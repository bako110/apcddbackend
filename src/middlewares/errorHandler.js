import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/apiResponse.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  logger.error({ err }, 'Unhandled error');

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    sendError(res, 'Validation failed', 400, details);
    return;
  }

  if (err.name === 'ValidationError') {
    // Mongoose validation error
    const details = Object.values(err.errors || {}).map((e) => e.message);
    sendError(res, 'Validation failed', 400, details);
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Identifiant invalide', 400);
    return;
  }

  if (err.code === 11000) {
    sendError(res, 'Ressource déjà existante', 409, err.keyValue);
    return;
  }

  if (err.name === 'DocumentNotFoundError') {
    sendError(res, 'Ressource introuvable', 404);
    return;
  }

  if (err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Fichier trop volumineux (10 Mo max)' : 'Fichier invalide';
    sendError(res, message, 400);
    return;
  }

  if (err.message === 'Type de fichier non autorisé') {
    sendError(res, err.message, 400);
    return;
  }

  const status = err.status || err.statusCode || 500;
  sendError(res, err.message || 'Erreur serveur interne', status);
}
