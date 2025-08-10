const express = require('express');
const multer = require('multer');
const eventController = require('../controllers/eventsController');

const router = express.Router();

// 📁 Config Multer pour upload images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 📌 Routes CRUD
router.post('/', upload.single('image'), eventController.createEvent);
router.get('/', eventController.getEvents);

// AJOUTER CETTE ROUTE GET POUR L'ÉVÉNEMENT PAR ID
router.get('/:id', eventController.getEventById);

router.put('/:id', upload.single('image'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
