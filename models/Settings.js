const mongoose = require('mongoose');

// Modèle Paramètres
const settingsSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


model.exports = mongoose.model('Settings', settingsSchema);