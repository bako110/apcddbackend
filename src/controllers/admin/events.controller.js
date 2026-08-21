import { Event } from '../../models/Event.model.js';
import { createCrudController } from './crudFactory.js';

export const { list: listEvents, getById: getEventById, create: createEvent, update: updateEvent, remove: removeEvent } =
  createCrudController(Event, { notFoundMessage: 'Événement introuvable' });
