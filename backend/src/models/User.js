const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        default: '',
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    purpose: {
        type: String,
        default: '',
    },
    subscriptionStatus: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
