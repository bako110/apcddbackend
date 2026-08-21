import mongoose from 'mongoose';

const { Schema } = mongoose;

const newsSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    // Saisie libre côté admin (les données existantes utilisent des libellés
    // français non contraints, ex. "environnement") : pas d'enum strict.
    category: { type: String, required: true, trim: true },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const News = mongoose.model('News', newsSchema);
