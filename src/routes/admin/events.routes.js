import { Router } from 'express';
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  removeEvent,
} from '../../controllers/admin/events.controller.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { eventSchema, eventUpdateSchema } from '../../validators/event.schema.js';

const router = Router();

router.get('/', listEvents);
router.get('/:id', getEventById);
router.post('/', validateRequest(eventSchema), createEvent);
router.put('/:id', validateRequest(eventUpdateSchema), updateEvent);
router.delete('/:id', removeEvent);

export default router;
