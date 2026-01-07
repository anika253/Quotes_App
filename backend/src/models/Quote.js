const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        default: 'Unknown',
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to the background image
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Quote', quoteSchema);
