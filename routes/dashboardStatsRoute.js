const express = require('express');
const router = express.Router();

const Member = require('../models/Member');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const Content = require('../models/Content');

router.get('/', async (req, res) => {
  try {
    const membersActive = await Member.countDocuments({ membershipPlan: "actif" });
    const eventsOrganized = await Event.countDocuments();

    const donationsAgg = await Donation.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);
    const donationsFCFA = donationsAgg.length > 0 ? donationsAgg[0].totalAmount : 0;

    const latestContent = await Content.findOne().sort({ _id: -1 }).exec();

    // Accès à treesPlanted dans stats
    const treesPlanted = latestContent?.stats?.treesPlanted || 0;

    res.json({
      membersActive,
      eventsOrganized,
      donationsFCFA,
      treesPlanted
    });
  } catch (error) {
    console.error('Erreur dans /dashboard-stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
