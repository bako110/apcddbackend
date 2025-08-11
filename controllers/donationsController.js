const Donation = require('../models/Donation');

const validPurposes = ["general", "environment", "culture", "education", "rural"];
const validPaymentMethods = ["mobile", "bank", "cash", "western"];
const validStatuses = ["pending", "completed", "failed"];

// Créer une donation
exports.createDonation = async (req, res) => {
  try {
    const {
      amount,
      donorName,
      donorEmail,
      donorPhone,
      donationPurpose = "general",
      paymentMethod,
      anonymous = false
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide." });
    }

    if (!paymentMethod || !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ error: "Mode de paiement invalide ou requis." });
    }

    if (!validPurposes.includes(donationPurpose)) {
      return res.status(400).json({ error: "Destination du don invalide." });
    }

    if (!anonymous && (!donorName || !donorEmail || !donorPhone)) {
      return res.status(400).json({ error: "Nom, email et téléphone requis pour un don non anonyme." });
    }

    const newDonation = new Donation({
      amount,
      donorName: anonymous ? null : donorName.trim(),
      donorEmail: anonymous ? null : donorEmail.trim(),
      donorPhone: anonymous ? null : donorPhone.trim(),
      donationPurpose,
      paymentMethod,
      anonymous,
      status: 'pending'  // par défaut à la création
    });

    await newDonation.save();
    res.status(201).json({ message: "Merci pour votre don !", donation: newDonation });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Récupérer toutes les donations, possibilité de filtrer par statut avec query param ?status=
exports.getDonations = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && validStatuses.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Mettre à jour le statut d'une donation
exports.updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Statut invalide." });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation non trouvée." });
    }

    donation.status = status;
    await donation.save();

    res.json({ message: "Statut mis à jour avec succès.", donation });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// Supprimer une donation
exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ error: "Donation non trouvée." });
    }

    await Donation.deleteOne({ _id: id });
    res.json({ message: "Donation supprimée avec succès." });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
