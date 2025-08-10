exports.getDonations = async (req, res) => {
  try {
    const donations = [
      {
        id: 1,
        donor: "Marie Sawadogo",
        amount: 25000,
        date: "2025-08-08"
      }
    ];
    
    res.status(200).json({
      status: 'success',
      data: donations
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    const stats = {
      total: 2500000,
      thisMonth: 456000,
      donorsCount: 189
    };
    
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};