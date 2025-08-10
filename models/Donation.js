const mongoose = require('mongoose');


// Modèle Donations
const donationSchema = new mongoose.Schema({
    donor: {
        name: String,
        email: String,
        phone: String,
        isAnonymous: {
            type: Boolean,
            default: false
        }
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'FCFA'
    },
    destination: {
        type: String,
        enum: ['general', 'environmental', 'cultural', 'community'],
        default: 'general'
    },
    paymentMethod: {
        type: String,
        enum: ['mobile_money', 'bank_transfer', 'cash', 'card'],
        required: true
    },
    transactionId: String,
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    receiptSent: {
        type: Boolean,
        default: false
    },
    notes: String
}, {
    timestamps: true
});


exports = mongoose.model('Donation', donationSchema);