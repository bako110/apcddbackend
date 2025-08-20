// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  associationName: { type: String, required: true },
  sigle: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  logo: { type: String },   // chemin fichier logo
  favicon: { type: String } // chemin fichier favicon
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
