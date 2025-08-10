const Event = require('../models/Event');

// 📌 Créer un événement
exports.createEvent = async (req, res) => {
    try {
        const { title, date, location, description, status } = req.body;
        const image = req.file ? req.file.filename : null;

        const event = new Event({ title, date, location, description, status, image });
        await event.save();

        res.status(201).json({ message: 'Événement créé', event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Lister tous les événements
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Mettre à jour un événement
exports.updateEvent = async (req, res) => {
    try {
        const updateData = req.body;
        if (req.file) updateData.image = req.file.filename;

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: 'Événement mis à jour', event: updatedEvent });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 📌 Supprimer un événement
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Événement supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }
    res.json(event);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
