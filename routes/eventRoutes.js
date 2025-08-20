const express = require('express');
const multer = require('multer');
const eventController = require('../controllers/eventsController');
const cloudinary = require('../cloudinaryConfig');
const { Readable } = require('stream');

const router = express.Router();

// Multer en mémoire pour pouvoir envoyer sur Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Fonction utilitaire pour uploader vers Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'events') => {
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
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'events');
            req.body.image = result.secure_url; // remplace le chemin local par l'URL Cloudinary
        }
        await eventController.createEvent(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', upload.single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'events');
            req.body.image = result.secure_url;
        }
        await eventController.updateEvent(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
