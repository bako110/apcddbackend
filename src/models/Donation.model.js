import mongoose from 'mongoose';
import { PAYMENT_METHOD_VALUES, DONATION_PURPOSE_VALUES } from '../shared/constants.js';

const { Schema } = mongoose;

const donationSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    donorName: { type: String, trim: true, default: null },
    donorEmail: { type: String, trim: true, lowercase: true, default: null },
    donorPhone: { type: String, trim: true, default: null },
    donationPurpose: {
      type: String,
      enum: DONATION_PURPOSE_VALUES,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHOD_VALUES,
      required: true,
    },
    anonymous: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Donation = mongoose.model('Donation', donationSchema);
