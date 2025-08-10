const mongoose = require('mongoose');

// Modèle Membres
const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        country: {
            type: String,
            default: 'Burkina Faso'
        }
    },
    membershipType: {
        type: String,
        enum: ['active', 'bienfaiteur', 'sympathisant'],
        default: 'sympathisant'
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'inactive', 'suspended'],
        default: 'pending'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    lastActivity: Date,
    skills: [String],
    interests: [String]
}, {
    timestamps: true
});


exports = mongoose.model('Member', memberSchema);