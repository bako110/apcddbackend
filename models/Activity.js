const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activity: { type: String, required: true },
  type: { type: String, required: true, enum: ['Membres', 'Événement', 'Finance', 'Contenu', 'Autre'] },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['actif', 'en cours', 'confirmé', 'publié', 'en attente', 'échoué', 'autre'], default: 'autre' },
  referenceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model('Activity', activitySchema);
