import mongoose from 'mongoose';

const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    // Pas de champ "key" : le vrai document de production (collection
    // "contents") est un singleton sans discriminant, il n'a jamais eu ce
    // champ. Un filtre `{ key: 'main' }` ne matcherait donc jamais ce
    // document réel (retour 404 en lecture, et création d'un doublon en
    // écriture via upsert) : on traite Content comme un singleton identifié
    // uniquement par son unicité de fait dans la collection.
    about: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, default: '', trim: true },
      description: { type: String, required: true, trim: true },
    },
    stats: {
      activeMembers: { type: Number, required: true, default: 0 },
      projectsDone: { type: Number, required: true, default: 0 },
      treesPlanted: { type: Number, required: true, default: 0 },
      villagesTouched: { type: Number, required: true, default: 0 },
    },
  },
  { timestamps: true }
);

export const Content = mongoose.model('Content', contentSchema);
