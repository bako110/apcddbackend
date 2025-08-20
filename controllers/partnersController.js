const Partner = require('../models/Partner');
const cloudinary = require('../cloudinaryConfig');

// Liste tous les partenaires
exports.getPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un partenaire par son ID
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partenaire non trouvé' });
    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un partenaire
exports.addPartner = async (req, res) => {
  try {
    const { name, type, website, description } = req.body;
    const partner = new Partner({
      name,
      type,
      website,
      description,
      logoUrl: req.body.logo || req.body.media, // URL Cloudinary
      public_id: req.body.public_id || null,    // stocker public_id si nécessaire
    });
    await partner.save();

    res.status(201).json({ message: 'Partenaire ajouté avec succès', partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un partenaire
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, website, description } = req.body;

    const partner = await Partner.findById(id);
    if (!partner) return res.status(404).json({ error: 'Partenaire non trouvé' });

    // Supprimer l'ancien logo Cloudinary si nouveau upload
    if (req.file && partner.public_id) {
      await cloudinary.uploader.destroy(partner.public_id);
      partner.logoUrl = req.body.logo || req.body.media;
      partner.public_id = req.body.public_id || null;
    }

    partner.name = name || partner.name;
    partner.type = type || partner.type;
    partner.website = website || partner.website;
    partner.description = description || partner.description;

    await partner.save();
    res.json({ message: 'Partenaire mis à jour', partner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un partenaire
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findById(id);
    if (!partner) return res.status(404).json({ error: 'Partenaire non trouvé' });

    // Supprimer le logo sur Cloudinary si public_id
    if (partner.public_id) {
      await cloudinary.uploader.destroy(partner.public_id);
    }

    await Partner.deleteOne({ _id: id });
    res.json({ message: 'Partenaire supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
