const Event = require('../models/Event');
const activitiesController = require('./activitiesController'); // Log activités
const cloudinary = require('../cloudinaryConfig');

// 📌 Créer un événement
exports.createEvent = async (req, res) => {
    try {
        const { title, date, location, description, status } = req.body;
        let imageUrl = req.body.image || req.body.media || null;
        let public_id = req.body.public_id || null;

        const event = new Event({ title, date, location, description, status, image: imageUrl, public_id });
        await event.save();

        // Log activité
        try {
            await activitiesController.logActivity({
                activity: `Création événement: ${title}`,
                type: 'Événement',
                status: status ? status.toLowerCase() : 'planifié',
                referenceId: event._id
            });
        } catch (err) {
            console.error('Erreur log activité:', err.message);
        }

        res.status(201).json({ message: 'Événement créé', event });
    } catch (err) {
        console.error('Erreur création événement:', err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 Lister tous les événements
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error('Erreur récupération événements:', err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 Récupérer un événement par ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Événement non trouvé' });
        res.json(event);
    } catch (err) {
        console.error('Erreur récupération événement:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// 📌 Mettre à jour un événement
exports.updateEvent = async (req, res) => {
    try {
        const updateData = req.body;

        // Supprimer l'ancien média Cloudinary si nouveau upload
        if (req.file && updateData.public_id && updateData.old_public_id) {
            try {
                await cloudinary.uploader.destroy(updateData.old_public_id);
            } catch (err) {
                console.error('Erreur suppression ancien média Cloudinary:', err.message);
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedEvent) return res.status(404).json({ error: 'Événement non trouvé' });

        // Log activité
        try {
            await activitiesController.logActivity({
                activity: `Mise à jour événement: ${updatedEvent.title}`,
                type: 'Événement',
                status: updatedEvent.status ? updatedEvent.status.toLowerCase() : 'modifié',
                referenceId: updatedEvent._id
            });
        } catch (err) {
            console.error('Erreur log activité:', err.message);
        }

        res.json({ message: 'Événement mis à jour', event: updatedEvent });
    } catch (err) {
        console.error('Erreur mise à jour événement:', err);
        res.status(500).json({ error: err.message });
    }
};

// 📌 Supprimer un événement
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Événement non trouvé' });

        // Supprimer l'image Cloudinary si public_id
        if (event.public_id) {
            try {
                await cloudinary.uploader.destroy(event.public_id);
            } catch (err) {
                console.error('Erreur suppression média Cloudinary:', err.message);
            }
        }

        await Event.deleteOne({ _id: event._id });

        // Log activité
        try {
            await activitiesController.logActivity({
                activity: `Suppression événement: ${event.title}`,
                type: 'Événement',
                status: 'supprimé',
                referenceId: event._id
            });
        } catch (err) {
            console.error('Erreur log activité:', err.message);
        }

        res.json({ message: 'Événement supprimé' });
    } catch (err) {
        console.error('Erreur suppression événement:', err);
        res.status(500).json({ error: err.message });
    }
};
