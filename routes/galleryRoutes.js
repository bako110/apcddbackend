const express = require('express');
const multer = require('multer');
const galleryController = require('../controllers/galleryController');
const cloudinary = require('../cloudinaryConfig');
const { Readable } = require('stream');

const router = express.Router();

// Multer en mémoire pour pouvoir uploader sur Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fonction utilitaire pour uploader vers Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'gallery') => {
    return new Promise((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(fileBuffer);
        bufferStream.push(null);

        const stream = cloudinary.uploader.upload_stream(
            { folder, use_filename: true },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        bufferStream.pipe(stream);
    });
};

// 📌 Routes CRUD

// Ajouter un élément à la galerie
router.post('/', upload.single('media'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'gallery');
            req.body.media = result.secure_url; // remplace le chemin local par l'URL Cloudinary
        }
        await galleryController.addGalleryItem(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Mettre à jour un élément
router.put('/:id', upload.single('media'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'gallery');
            req.body.media = result.secure_url;
        }
        await galleryController.updateGalleryItem(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Récupérer tous les éléments
router.get('/', galleryController.getGalleryItems);

// Récupérer par ID
router.get('/:id', galleryController.getGalleryItemById);

// Supprimer un élément
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
