const express = require('express');
const multer = require('multer');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

// Multer en mémoire pour pouvoir uploader sur Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Routes CRUD

// Ajouter un élément à la galerie
router.post('/', upload.single('media'), async (req, res, next) => {
    try {
        await galleryController.addGalleryItem(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Mettre à jour un élément
router.put('/:id', upload.single('media'), async (req, res, next) => {
    try {
        await galleryController.updateGalleryItem(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Récupérer tous les éléments
router.get('/', galleryController.getGalleryItems);

// Récupérer un élément par ID
router.get('/:id', galleryController.getGalleryItemById);

// Supprimer un élément
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
