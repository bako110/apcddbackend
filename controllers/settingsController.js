// controllers/settingsController.js
const Settings = require('../models/Settings');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const cloudinary = require('../cloudinaryConfig');
const streamifier = require('streamifier');

// -------- UTILITAIRE CLOUDINARY --------
const uploadToCloudinary = (buffer, folder = 'settings') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// -------- PARAMÈTRES GÉNÉRAUX --------
exports.updateSettings = async (req, res) => {
  try {
    const { associationName, sigle, address, phone, email, description } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ associationName, sigle, address, phone, email, description });
    } else {
      settings.associationName = associationName;
      settings.sigle = sigle;
      settings.address = address;
      settings.phone = phone;
      settings.email = email;
      settings.description = description;
    }

    await settings.save();
    res.json({ message: "Paramètres mis à jour avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// -------- CHANGEMENT DE MOT DE PASSE --------
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, adminId } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Administrateur non trouvé" });

    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) return res.status(400).json({ message: "Mot de passe actuel incorrect" });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({ message: "Mot de passe changé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// -------- AJOUT ADMINISTRATEUR --------
exports.addAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const admin = new Admin({ name, email, password });
    await admin.save();

    res.json({ message: "Administrateur créé avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// -------- UPLOAD LOGO / FAVICON --------
exports.uploadLogo = async (req, res) => {
  try {
    const { logo, favicon } = req.files; // via multer.fields
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (logo && logo[0] && logo[0].buffer) {
      const result = await uploadToCloudinary(logo[0].buffer, 'settings/logo');
      settings.logo = result.secure_url;
    }

    if (favicon && favicon[0] && favicon[0].buffer) {
      const result = await uploadToCloudinary(favicon[0].buffer, 'settings/favicon');
      settings.favicon = result.secure_url;
    }

    await settings.save();
    res.json({ message: "Logo et favicon mis à jour !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
