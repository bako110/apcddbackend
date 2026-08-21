import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string().trim().min(2, 'validation.name.min'),
  type: z.string().trim().min(2, 'validation.type.min'),
  description: z.string().trim().optional().default(''),
  logoUrl: z.string().trim().optional().default(''),
  website: z.string().trim().optional().default(''),
});

export const partnerUpdateSchema = partnerSchema.partial();
