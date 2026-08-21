import { Event } from '../models/Event.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sortEventsByPriorityThenDate } from '../services/events.service.js';

export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().lean();
  sendSuccess(res, sortEventsByPriorityThenDate(events));
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).lean();
  if (!event) {
    sendError(res, 'Événement introuvable', 404);
    return;
  }
  sendSuccess(res, event);
});
