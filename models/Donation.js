const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  donorEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  donorPhone: {
    type: String,
    required: true,
    trim: true
  },
  donationPurpose: {
    type: String,
    enum: ['general', 'environment', 'culture', 'education', 'rural'],
    default: 'general'
  },
  paymentMethod: {
    type: String,
    enum: ['mobile', 'bank', 'cash', 'western'],
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
