const Content = require('../models/Content');

// Récupérer le contenu global
exports.getContent = async (req, res) => {
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour la section À propos
exports.updateAbout = async (req, res) => {
  const { title, subtitle, description } = req.body;
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content();
    }
    content.about.title = title || '';
    content.about.subtitle = subtitle || '';
    content.about.description = description || '';
    await content.save();
    res.json({ message: 'Section À propos mise à jour.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour les statistiques
exports.updateStats = async (req, res) => {
  const { activeMembers, projectsDone, treesPlanted, villagesTouched } = req.body;
  try {
    let content = await Content.findOne();
    if (!content) {
      content = new Content();
    }
    content.stats.activeMembers = activeMembers || 0;
    content.stats.projectsDone = projectsDone || 0;
    content.stats.treesPlanted = treesPlanted || 0;
    content.stats.villagesTouched = villagesTouched || 0;
    await content.save();
    res.json({ message: 'Statistiques mises à jour.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/contentController.js

exports.getState = (req, res) => {
  const content = {
    _id: "6897e990dcb05236dafe50b8",
    stats: {
      activeMembers: 1200,
      projectsDone: 75,
      treesPlanted: 50000,
      villagesTouched: 79
    },
    __v: 0
  };

  res.json(content);
};
