import mongoose from 'mongoose';

const { Schema } = mongoose;

const partnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    logoUrl: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export const Partner = mongoose.model('Partner', partnerSchema);
