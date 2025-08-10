const Donation = require('../models/Donation');

const validPurposes = ["general", "environment", "culture", "education", "rural"];
const validPaymentMethods = ["mobile", "bank", "cash", "western"];

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

    // Vérifications simples
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
      anonymous
    });

    await newDonation.save();

    res.status(201).json({ message: "Merci pour votre don !" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur." });
  }
};
