import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

/**
 * Fabrique un ensemble de handlers CRUD génériques pour un modèle Mongoose donné.
 * Utilisé par les ressources admin qui n'ont pas de besoin métier spécifique
 * (events, gallery, news, partners).
 */
export function createCrudController(Model, { notFoundMessage = 'Ressource introuvable' } = {}) {
  const list = asyncHandler(async (req, res) => {
    const items = await Model.find().sort({ createdAt: -1 }).lean();
    sendSuccess(res, items);
  });

  const getById = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id).lean();
    if (!item) {
      sendError(res, notFoundMessage, 404);
      return;
    }
    sendSuccess(res, item);
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    sendSuccess(res, item, 201);
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      sendError(res, notFoundMessage, 404);
      return;
    }
    sendSuccess(res, item);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) {
      sendError(res, notFoundMessage, 404);
      return;
    }
    sendSuccess(res, { message: 'Suppression réussie' });
  });

  return { list, getById, create, update, remove };
}
