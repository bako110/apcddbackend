const GalleryItem = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

// Ajouter un élément à la galerie (image/vidéo)
exports.addGalleryItem = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Fichier requis' });
    }

    const newItem = new GalleryItem({
      title,
      category,
      description,
      imageUrl: `/uploads/${req.file.filename}`,  // le chemin relatif pour l'accès public
    });

    await newItem.save();

    res.status(201).json({ message: 'Fichier ajouté à la galerie', item: newItem });
  } catch (error) {
    console.error('Erreur ajout galerie:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout à la galerie' });
  }
};

// Récupérer tous les éléments de la galerie
exports.getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Erreur récupération galerie:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
};

// Mettre à jour un élément de la galerie
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;

    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Fichier non trouvé' });

    // Supprimer l'ancien fichier du serveur si un nouveau est uploadé
    if (req.file) {
      const oldPath = path.join(__dirname, '..', 'uploads', path.basename(item.imageUrl));
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    item.title = title ?? item.title;
    item.category = category ?? item.category;
    item.description = description ?? item.description;

    await item.save();

    res.json({ message: 'Fichier mis à jour', item });
  } catch (error) {
    console.error('Erreur mise à jour galerie:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
};

// Supprimer un élément de la galerie
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Fichier non trouvé' });

    const filePath = path.join(__dirname, '..', 'uploads', path.basename(item.imageUrl));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await GalleryItem.findByIdAndDelete(id);

    res.json({ message: 'Fichier supprimé' });
  } catch (error) {
    console.error('Erreur suppression galerie:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

// Récupérer un élément de la galerie par ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Fichier non trouvé' });
    res.json(item);
  } catch (error) {
    console.error('Erreur récupération fichier galerie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
