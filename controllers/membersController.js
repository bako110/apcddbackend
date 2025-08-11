const Member = require('../models/Member');
const activitiesController = require('./activitiesController'); // Import du controller d'activités

// Créer un nouveau membre
exports.createMember = async (req, res) => {
  try {
    const {
      membershipPlan,
      fullName,
      email,
      phone,
      city,
      profession,
      motivation,
      termsAgreement,
      status // optionnel : peut venir du front ou par défaut
    } = req.body;

    if (!termsAgreement) {
      return res.status(400).json({ error: "Vous devez accepter les conditions d'adhésion." });
    }

    const newMember = new Member({
      membershipPlan,
      fullName,
      email,
      phone,
      city,
      profession,
      motivation,
      termsAgreement,
      status: status || 'pending'  // valeur par défaut
    });

    await newMember.save();

    // Log activité
    try {
      await activitiesController.logActivity({
        activity: `Nouvel adhésion membre: ${newMember.fullName}`,
        type: 'Membres',
        status: newMember.status.toLowerCase(),
        referenceId: newMember._id
      });
    } catch (err) {
      console.error('Erreur log activité:', err.message);
    }

    res.status(201).json({ message: "Inscription réussie !", member: newMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Récupérer tous les membres
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Récupérer un membre par ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Membre non trouvé." });
    }
    res.json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Mettre à jour un membre par ID
exports.updateMember = async (req, res) => {
  try {
    const updateData = req.body;
    if ('termsAgreement' in updateData && !updateData.termsAgreement) {
      return res.status(400).json({ error: "Vous devez accepter les conditions d'adhésion." });
    }
    const member = await Member.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!member) {
      return res.status(404).json({ error: "Membre non trouvé." });
    }

    // Log activité
    try {
      await activitiesController.logActivity({
        activity: `Mise à jour membre: ${member.fullName}`,
        type: 'Membres',
        status: member.status.toLowerCase(),
        referenceId: member._id
      });
    } catch (err) {
      console.error('Erreur log activité:', err.message);
    }

    res.json({ message: "Membre mis à jour.", member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Supprimer un membre par ID
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Membre non trouvé." });
    }

    // Log activité
    try {
      await activitiesController.logActivity({
        activity: `Suppression membre: ${member.fullName}`,
        type: 'Membres',
        status: 'supprimé',
        referenceId: member._id
      });
    } catch (err) {
      console.error('Erreur log activité:', err.message);
    }

    res.json({ message: "Membre supprimé." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
