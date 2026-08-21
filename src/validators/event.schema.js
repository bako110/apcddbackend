import { z } from 'zod';
import { EVENT_STATUS_VALUES } from '../shared/constants.js';

export const eventSchema = z.object({
  title: z.string().trim().min(2, 'validation.title.min'),
  description: z.string().trim().min(2, 'validation.description.min'),
  date: z.coerce.date(),
  location: z.string().trim().min(2, 'validation.location.min'),
  image: z.string().trim().optional().default(''),
  status: z.enum(EVENT_STATUS_VALUES, {
    errorMap: () => ({ message: 'validation.status.invalid' }),
  }),
});

export const eventUpdateSchema = eventSchema.partial();
