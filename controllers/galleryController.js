// controllers/galleryController.js
const GalleryItem = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

exports.addGalleryItem = async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image requise' });

    const newItem = new GalleryItem({
      title,
      category,
      description,
      imageUrl: `/uploads/${req.file.filename}`
    });
    await newItem.save();

    res.status(201).json({ message: 'Image ajoutée à la galerie', item: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout à la galerie' });
  }
};

exports.getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des images' });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;

    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Image non trouvée' });

    // Si nouvelle image uploadée, supprimer ancienne image du serveur
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(item.imageUrl));
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    item.title = title || item.title;
    item.category = category || item.category;
    item.description = description || item.description;

    await item.save();

    res.json({ message: 'Image mise à jour', item });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Image non trouvée' });

    // Supprimer l’image physique
    const imagePath = path.join(__dirname, '..', 'uploads', path.basename(item.imageUrl));
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await GalleryItem.findByIdAndDelete(id);

    res.json({ message: 'Image supprimée' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
