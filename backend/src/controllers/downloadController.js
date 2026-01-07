const Download = require('../models/Download');

exports.saveDownload = async (req, res) => {
    try {
        const { imageUrl, quoteId } = req.body;
        const userId = req.userData.userId;

        const download = new Download({
            userId,
            imageUrl,
            quoteId
        });

        await download.save();
        res.status(201).json({ message: 'Download saved successfully', download });
    } catch (error) {
        console.error('Error saving download:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserDownloads = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const downloads = await Download.find({ userId }).sort({ downloadedAt: -1 });
        res.status(200).json(downloads);
    } catch (error) {
        console.error('Error fetching downloads:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
