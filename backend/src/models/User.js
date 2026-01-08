const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true, // Allows multiple null values but unique non-null values
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    userImage: {
        type: String, // Base64 encoded image or URL
    },
    purpose: {
        type: String,
        enum: ['personal', 'business', 'education'],
    },
    subscriptionStatus: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free',
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    showDate: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
