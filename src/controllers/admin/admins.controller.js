import bcrypt from 'bcryptjs';
import { Admin } from '../../models/Admin.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

const SALT_ROUNDS = 10;

function toPublicAdmin(admin) {
  return {
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

export const listAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().sort({ createdAt: -1 }).lean();
  sendSuccess(res, admins.map(toPublicAdmin));
});

export const getAdminById = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id).lean();
  if (!admin) {
    sendError(res, 'Administrateur introuvable', 404);
    return;
  }
  sendSuccess(res, toPublicAdmin(admin));
});

export const createAdmin = asyncHandler(async (req, res) => {
  const existing = await Admin.findOne({ email: req.body.email.toLowerCase() });
  if (existing) {
    sendError(res, 'Un compte existe déjà avec cet email', 409);
    return;
  }

  const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
  const admin = await Admin.create({
    name: req.body.name,
    email: req.body.email,
    password: passwordHash,
    role: req.body.role,
  });

  sendSuccess(res, toPublicAdmin(admin), 201);
});

export const updateAdmin = asyncHandler(async (req, res) => {
  const update = { ...req.body };
  if (update.password) {
    update.password = await bcrypt.hash(update.password, SALT_ROUNDS);
  }

  // Empêche de se retirer soi-même le rôle superadmin par erreur.
  if (req.params.id === req.admin.id && update.role && update.role !== 'superadmin') {
    sendError(res, 'Vous ne pouvez pas modifier votre propre rôle', 400);
    return;
  }

  const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!admin) {
    sendError(res, 'Administrateur introuvable', 404);
    return;
  }

  sendSuccess(res, toPublicAdmin(admin));
});

export const removeAdmin = asyncHandler(async (req, res) => {
  if (req.params.id === req.admin.id) {
    sendError(res, 'Vous ne pouvez pas supprimer votre propre compte', 400);
    return;
  }

  const target = await Admin.findById(req.params.id);
  if (!target) {
    sendError(res, 'Administrateur introuvable', 404);
    return;
  }

  if (target.role === 'superadmin') {
    const superadminCount = await Admin.countDocuments({ role: 'superadmin' });
    if (superadminCount <= 1) {
      sendError(res, 'Impossible de supprimer le dernier administrateur principal', 400);
      return;
    }
  }

  await Admin.findByIdAndDelete(req.params.id);
  sendSuccess(res, { message: 'Suppression réussie' });
});
