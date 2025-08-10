exports.getMembers = async (req, res) => {
  try {
    const members = [
      {
        id: 1,
        name: "Amadou Barro",
        email: "amadou.barro@email.com",
        status: "active"
      }
    ];
    
    res.status(200).json({
      status: 'success',
      data: members
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.updateMemberStatus = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status } = req.body;
    
    console.log(`Membre ${memberId} mis à jour avec le statut: ${status}`);
    
    res.status(200).json({
      status: 'success',
      message: 'Statut du membre mis à jour'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};