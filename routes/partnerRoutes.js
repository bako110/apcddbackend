const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnersController');
const multer = require('multer');
const path = require('path');

// Configuration Multer (même logique que précédemment)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); // dossier uploads à la racine
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Seules les images sont autorisées'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Routes partenaires
router.get('/', partnerController.getPartners);
router.get('/:id', partnerController.getPartnerById); // Ajout de la route GET partenaire par ID
router.post('/', upload.single('logo'), partnerController.addPartner);
router.put('/:id', upload.single('logo'), partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
