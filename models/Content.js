const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  about: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  stats: {
    activeMembers: { type: Number, default: 0 },
    projectsDone: { type: Number, default: 0 },
    treesPlanted: { type: Number, default: 0 },
    villagesTouched: { type: Number, default: 0 },
  }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
