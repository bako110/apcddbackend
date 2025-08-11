// routes/galleryRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const galleryController = require('../controllers/galleryController');

const router = express.Router();

// Multer config stockage des images dans dossier 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes CRUD
// Adapter multer à attendre le champ 'media' (au lieu de 'image')
router.post('/', upload.single('media'), galleryController.addGalleryItem);
router.get('/', galleryController.getGalleryItems);

// Route GET par ID
router.get('/:id', galleryController.getGalleryItemById);

// Même adaptation pour update (PUT)
router.put('/:id', upload.single('media'), galleryController.updateGalleryItem);

router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
