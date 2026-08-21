import mongoose from 'mongoose';

const { Schema } = mongoose;

const memberSchema = new Schema(
  {
    // Validé côté formulaire public par memberSchema (Zod, src/shared/schemas.js) ;
    // pas d'enum Mongoose strict pour rester compatible avec les documents
    // existants créés par l'ancien backend.
    membershipPlan: { type: String, required: true, trim: true },
    status: { type: String, default: 'pending', trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    motivation: { type: String, required: true, trim: true },
    termsAgreement: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export const Member = mongoose.model('Member', memberSchema);
