const express = require('express');
const multer = require('multer');
const path = require('path');
const newsController = require('../controllers/newsController');

const router = express.Router();

// Config Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CRUD
router.post('/', upload.single('image'), newsController.addNews);
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.put('/:id', upload.single('image'), newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
