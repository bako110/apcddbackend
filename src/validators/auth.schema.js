import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('validation.email.invalid'),
  password: z.string().min(1, 'validation.password.required'),
});
