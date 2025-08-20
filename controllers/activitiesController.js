const Activity = require('../models/Activity');

// Créer un log d'activité (fonction utilitaire, pas une route HTTP)
exports.logActivity = async (data) => {
  try {
    const { activity, type, status = 'autre', referenceId = null, metadata = {} } = data;

    if (!activity || !type) {
      throw new Error('Champs obligatoires manquants (activity, type)');
    }

    const validTypes = ['Membres', 'Événement', 'Finance', 'Contenu', 'Autre'];
    const validStatuses = ['actif', 'en cours', 'confirmé', 'publié', 'en attente', 'échoué', 'autre'];

    if (!validTypes.includes(type)) {
      throw new Error('Type d\'activité invalide');
    }
    if (!validStatuses.includes(status)) {
      throw new Error('Statut d\'activité invalide');
    }

    const newActivity = new Activity({
      activity,
      type,
      status,
      referenceId,
      metadata,
      date: new Date()
    });

    await newActivity.save();
    return newActivity;
  } catch (error) {
    console.error('Erreur logActivity:', error.message);
    throw error;
  }
};

// Récupérer les activités avec filtres, pagination
exports.getActivities = async (req, res) => {
  try {
    const { type, status, since, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (since) filter.date = { $gt: new Date(since) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Activity.countDocuments(filter)
    ]);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      data: activities
    });
  } catch (error) {
    console.error('Erreur getActivities:', error.message);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des activités.' });
  }
};

// Supprimer une activité par ID
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Activity.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Activité non trouvée.' });

    res.json({ message: 'Activité supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur deleteActivity:', error.message);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l’activité.' });
  }
};
// Créer une activité via POST HTTP
exports.createActivity = async (req, res) => {
  try {
    const { activity, type, status = 'autre', referenceId = null, metadata = {} } = req.body;

    if (!activity || !type) {
      return res.status(400).json({ error: 'Champs obligatoires manquants (activity, type)' });
    }

    const validTypes = ['Membres', 'Événement', 'Finance', 'Contenu', 'Autre'];
    const validStatuses = ['actif', 'en cours', 'confirmé', 'publié', 'en attente', 'échoué', 'autre'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Type d\'activité invalide' });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut d\'activité invalide' });
    }

    // const newActivity = new Activity({
    //   activity,
    //   type,
    //   status,
    //   referenceId,
    //   metadata,
    //   date: new Date()
    // });

    // await newActivity.save();
    // res.status(201).json(newActivity);
  } catch (error) {
    console.error('Erreur createActivity:', error.message);
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'activité.' });
  }
};
