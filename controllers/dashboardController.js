exports.getDashboardStats = async (req, res) => {
  try {
    // Exemple de données statiques (à remplacer par vos appels à la base de données)
    const stats = {
      activeMembers: 1247,
      organizedEvents: 78,
      totalDonations: 2500000,
      plantedTrees: 52340
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

exports.getRecentActivities = async (req, res) => {
  try {
    const activities = [
      {
        activity: "Nouvel adhésion membre",
        type: "Membres",
        date: "Aujourd'hui 14:30",
        status: "Actif"
      },
      {
        activity: "Festival Culturel 2025",
        type: "Événement",
        date: "Hier 09:15",
        status: "En cours"
      }
    ];

    res.status(200).json({
      status: 'success',
      data: activities
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};