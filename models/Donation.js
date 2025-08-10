const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true,
    min: [1, "Le montant doit être supérieur à 0"]
  },
  donorName: { 
    type: String,
    trim: true,
    required: function() { return !this.anonymous; } // obligatoire si pas anonyme
  },
  donorEmail: { 
    type: String,
    trim: true,
    lowercase: true,
    required: function() { return !this.anonymous; }
  },
  donorPhone: { 
    type: String,
    trim: true,
    required: function() { return !this.anonymous; }
  },
  donationPurpose: { 
    type: String, 
    enum: ["general", "environment", "culture", "education", "rural"], 
    default: "general" 
  },
  paymentMethod: { 
    type: String, 
    enum: ["mobile", "bank", "cash", "western"], 
    required: true 
  },
  anonymous: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Donation', donationSchema);
