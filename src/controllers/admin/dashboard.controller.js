import { Member } from '../../models/Member.model.js';
import { Donation } from '../../models/Donation.model.js';
import { Event } from '../../models/Event.model.js';
import { News } from '../../models/News.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../utils/apiResponse.js';

const DAYS_RANGE = 30;

export const getDashboard = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - DAYS_RANGE * 24 * 60 * 60 * 1000);

  const [
    totalMembers,
    totalDonations,
    totalEvents,
    totalNews,
    donationAmountAgg,
    recentDonations,
    recentMembers,
    donationsByDay,
  ] = await Promise.all([
    Member.countDocuments(),
    Donation.countDocuments(),
    Event.countDocuments(),
    News.countDocuments(),
    Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Donation.find().sort({ createdAt: -1 }).limit(5).lean(),
    Member.find().sort({ createdAt: -1 }).limit(5).lean(),
    Donation.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  sendSuccess(res, {
    stats: {
      totalMembers,
      totalDonations,
      totalDonationAmount: donationAmountAgg[0]?.total ?? 0,
      totalEvents,
      totalNews,
    },
    recentDonations,
    recentMembers,
    donationsByDay: donationsByDay.map((d) => ({ date: d._id, total: d.total, count: d.count })),
  });
});
