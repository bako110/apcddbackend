const GalleryItem = require('../models/Gallery');
import cloudinary from '../cloudinaryConfig.js';
import streamifier from 'streamifier';

// Fonction utilitaire pour uploader sur Cloudinary depuis buffer
const uploadToCloudinary = (buffer, folder = 'gallery') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Ajouter un élément à la galerie
export const addGalleryItem = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Fichier requis' });
    }

    // Upload sur Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    const newItem = new GalleryItem({
      title,
      category,
      description,
      imageUrl: result.secure_url,
      public_id: result.public_id
    });

    await newItem.save();

    res.status(201).json({ message: 'Fichier ajouté à la galerie', item: newItem });
  } catch (error) {
    console.error('Erreur ajout galerie:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout à la galerie' });
  }
};

// Mettre à jour un élément
export const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;

    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Fichier non trouvé' });

    // Remplacer l'image si un nouveau fichier est uploadé
    if (req.file) {
      if (item.public_id) await cloudinary.uploader.destroy(item.public_id);
      const result = await uploadToCloudinary(req.file.buffer);
      item.imageUrl = result.secure_url;
      item.public_id = result.public_id;
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

// Supprimer un élément
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Fichier non trouvé' });

    if (item.public_id) await cloudinary.uploader.destroy(item.public_id);
    await GalleryItem.findByIdAndDelete(id);

    res.json({ message: 'Fichier supprimé' });
  } catch (error) {
    console.error('Erreur suppression galerie:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

// Récupérer tous les éléments
export const getGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Erreur récupération galerie:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
};

// Récupérer un élément par ID
export const getGalleryItemById = async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Fichier non trouvé' });
    res.json(item);
  } catch (error) {
    console.error('Erreur récupération fichier galerie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
