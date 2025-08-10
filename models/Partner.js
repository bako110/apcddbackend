const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['institutional', 'financial', 'technical', 'strategic'], 
    required: true 
  },
  website: { type: String },
  description: { type: String },
  logoUrl: { type: String }, // URL du fichier image (ex: /uploads/xyz.png)
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
