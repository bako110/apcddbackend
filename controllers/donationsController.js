const Donation = require('../models/Donation');

exports.createDonation = async (req, res) => {
  try {
    const {
      amount,
      donorName,
      donorEmail,
      donorPhone,
      donationPurpose,
      paymentMethod,
      anonymous
    } = req.body;

    // Validation simple
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Montant du don invalide." });
    }
    if (!donorName && !anonymous) {
      return res.status(400).json({ error: "Le nom du donateur est requis sauf pour don anonyme." });
    }
    if (!donorEmail && !anonymous) {
      return res.status(400).json({ error: "L'email du donateur est requis sauf pour don anonyme." });
    }
    if (!donorPhone && !anonymous) {
      return res.status(400).json({ error: "Le téléphone du donateur est requis sauf pour don anonyme." });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: "Le mode de paiement est requis." });
    }

    // Création donation
    const newDonation = new Donation({
      amount,
      donorName: anonymous ? 'Anonyme' : donorName,
      donorEmail: anonymous ? '' : donorEmail,
      donorPhone: anonymous ? '' : donorPhone,
      donationPurpose,
      paymentMethod,
      anonymous: !!anonymous
    });

    await newDonation.save();

    res.status(201).json({ message: "Merci pour votre don !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
