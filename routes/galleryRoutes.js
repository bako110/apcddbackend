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
router.post('/', upload.single('image'), galleryController.addGalleryItem);
router.get('/', galleryController.getGalleryItems);

// **Ajout de la route GET par ID**
router.get('/:id', galleryController.getGalleryItemById);

router.put('/:id', upload.single('image'), galleryController.updateGalleryItem);
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
