import mongoose from 'mongoose';

const { Schema } = mongoose;

export const ADMIN_ROLES = ['superadmin', 'manager'];

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    // Le compte historique (créé avant l'introduction des rôles) est traité
    // comme superadmin par défaut : seul un superadmin peut gérer les comptes.
    role: { type: String, enum: ADMIN_ROLES, default: 'manager' },
  },
  { timestamps: true }
);

export const Admin = mongoose.model('Admin', adminSchema, 'admins');
