const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationsController');

router.post('/', donationController.createDonation);
router.get('/', donationController.getDonations);

module.exports = router;
