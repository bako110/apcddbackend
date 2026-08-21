import mongoose from 'mongoose';
import { EVENT_STATUS_VALUES } from '../shared/constants.js';

const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: EVENT_STATUS_VALUES,
      required: true,
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
