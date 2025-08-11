const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', contentController.getContent);
router.post('/about', contentController.updateAbout);
router.post('/stats', contentController.updateStats);
router.get('/state', contentController.getState); 

module.exports = router;
