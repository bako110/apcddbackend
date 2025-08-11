const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');

// GET /api/activities
router.get('/', activitiesController.getActivities);

// POST /api/activities
router.post('/', activitiesController.createActivity);

// DELETE /api/activities/:id
router.delete('/:id', activitiesController.deleteActivity);

module.exports = router;
