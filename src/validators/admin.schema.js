import { z } from 'zod';
import { ADMIN_ROLES } from '../models/Admin.model.js';

export const adminCreateSchema = z.object({
  name: z.string().trim().min(2, 'validation.name.min'),
  email: z.string().trim().email('validation.email.invalid'),
  password: z.string().min(8, 'validation.password.min'),
  role: z.enum(ADMIN_ROLES).optional().default('manager'),
});

export const adminUpdateSchema = z.object({
  name: z.string().trim().min(2, 'validation.name.min').optional(),
  email: z.string().trim().email('validation.email.invalid').optional(),
  password: z.string().min(8, 'validation.password.min').optional(),
  role: z.enum(ADMIN_ROLES).optional(),
});
