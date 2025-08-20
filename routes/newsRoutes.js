const express = require('express');
const multer = require('multer');
const newsController = require('../controllers/newsController');
const cloudinary = require('../cloudinaryConfig');
const { Readable } = require('stream');

const router = express.Router();

// Multer en mémoire pour pouvoir uploader sur Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fonction utilitaire pour uploader vers Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'news') => {
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

// Ajouter une news
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'news');
            req.body.image = result.secure_url; // remplace le chemin local par l'URL Cloudinary
        }
        await newsController.addNews(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Mettre à jour une news
router.put('/:id', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'news');
            req.body.image = result.secure_url;
        }
        await newsController.updateNews(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Récupérer toutes les news
router.get('/', newsController.getAllNews);

// Récupérer une news par ID
router.get('/:id', newsController.getNewsById);

// Supprimer une news
router.delete('/:id', newsController.deleteNews);

module.exports = router;
