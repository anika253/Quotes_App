exports.getCategories = (req, res) => {
    const categories = ['Good Morning', 'Motivational', 'Shayari', 'Religious', 'Love', 'Festival'];
    res.status(200).json({ categories });
};
