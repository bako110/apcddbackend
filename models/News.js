const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    featured: { type: Boolean, default: false },
    image: { type: String } // chemin du fichier image
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
