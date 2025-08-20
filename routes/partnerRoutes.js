const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnersController');
const multer = require('multer');
const cloudinary = require('../cloudinaryConfig');
const { Readable } = require('stream');

// Multer en mémoire
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Seules les images sont autorisées'), false);
        }
        cb(null, true);
    }
});

// Fonction utilitaire pour uploader sur Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'partners') => {
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

// Routes partenaires

// Récupérer tous les partenaires
router.get('/', partnerController.getPartners);

// Récupérer partenaire par ID
router.get('/:id', partnerController.getPartnerById);

// Ajouter un partenaire
router.post('/', upload.single('logo'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'partners');
            req.body.logo = result.secure_url; // remplace le chemin local par URL Cloudinary
        }
        await partnerController.addPartner(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Mettre à jour un partenaire
router.put('/:id', upload.single('logo'), async (req, res, next) => {
    try {
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'partners');
            req.body.logo = result.secure_url;
        }
        await partnerController.updatePartner(req, res, next);
    } catch (err) {
        next(err);
    }
});

// Supprimer un partenaire
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
