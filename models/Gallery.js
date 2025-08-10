// models/GalleryItem.js
const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['festivals', 'environment', 'community'], 
    required: true 
  },
  description: { type: String },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
