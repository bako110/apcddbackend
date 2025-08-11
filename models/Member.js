const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  membershipPlan: {
    type: String,
    required: true,
    enum: ['sympathisant', 'actif', 'bienfaiteur']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'pending', 'inactive'], // tu peux adapter les valeurs
    default: 'pending' // valeur par défaut si tu veux
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  profession: { type: String, required: true },
  motivation: { type: String, required: true },
  termsAgreement: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
