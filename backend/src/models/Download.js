const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quoteId: {
        type: String, // Can be a reference to Quote model or just a string ID
    },
    imageUrl: {
        type: String,
        required: true,
    },
    downloadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Download', downloadSchema);
