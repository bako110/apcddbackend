import mongoose from 'mongoose';

const { Schema } = mongoose;

const gallerySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    // Saisie libre côté admin, pas d'enum strict (cohérent avec News.category).
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// La collection existante en base (créée par l'ancien backend) s'appelle
// "galleryitems", pas le "gallerys" que Mongoose déduirait par défaut du nom
// du modèle : on le fixe explicitement pour pointer sur les vraies données.
export const Gallery = mongoose.model('Gallery', gallerySchema, 'galleryitems');
