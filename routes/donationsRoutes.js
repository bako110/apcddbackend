const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationsController');

router.post('/', donationController.createDonation);
router.get('/', donationController.getDonations);
router.patch('/:id/status', donationController.updateDonationStatus);
router.delete('/:id', donationController.deleteDonation);

module.exports = router;
