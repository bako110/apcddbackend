import { z } from 'zod';

export const contentSchema = z.object({
  about: z.object({
    title: z.string().trim().min(2, 'validation.title.min'),
    subtitle: z.string().trim().optional().default(''),
    description: z.string().trim().min(2, 'validation.description.min'),
  }),
  stats: z.object({
    activeMembers: z.coerce.number().int().min(0),
    projectsDone: z.coerce.number().int().min(0),
    treesPlanted: z.coerce.number().int().min(0),
    villagesTouched: z.coerce.number().int().min(0),
  }),
});

export const contentUpdateSchema = contentSchema.partial();
