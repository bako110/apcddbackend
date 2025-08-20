const GalleryItem = require('../models/Gallery');
const cloudinary = require('../cloudinaryConfig');

// Ajouter un élément à la galerie (image/vidéo)
exports.addGalleryItem = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Fichier requis' });
    }

    // L'URL Cloudinary est déjà ajoutée par le router dans req.body.image/media
    const newItem = new GalleryItem({
      title,
      category,
      description,
      imageUrl: req.body.media || req.body.image, // récupère l'URL Cloudinary
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

    // Remplacer l'image si un nouveau fichier est uploadé
    if (req.file) {
      // Supprimer l'ancien fichier Cloudinary si tu stockes public_id
      if (item.public_id) {
        await cloudinary.uploader.destroy(item.public_id);
      }
      item.imageUrl = req.body.media || req.body.image;
      item.public_id = req.body.public_id; // à ajouter lors de l'upload si nécessaire
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

    // Supprimer le fichier sur Cloudinary si tu stockes public_id
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
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
