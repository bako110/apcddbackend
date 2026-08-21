import { z } from 'zod';
import { MEMBER_STATUS_VALUES } from '../shared/constants.js';

export const memberStatusSchema = z.object({
  status: z.enum(MEMBER_STATUS_VALUES, {
    errorMap: () => ({ message: 'validation.status.invalid' }),
  }),
});
