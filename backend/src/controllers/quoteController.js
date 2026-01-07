const Quote = require('../models/Quote');

exports.getQuotes = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const quotes = await Quote.find(query);
        res.status(200).json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Quote.distinct('category');
        if (categories.length === 0) {
            // Fallback if DB is empty
            return res.status(200).json(['Good Morning', 'Motivational', 'Shayari', 'Religious', 'Love', 'Festival']);
        }
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
