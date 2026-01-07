const User = require('../models/User');

exports.setupProfile = async (req, res) => {
    try {
        const { phoneNumber, name, email, purpose } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const user = await User.findOneAndUpdate(
            { phoneNumber },
            { 
                name, 
                email, 
                purpose, 
                isProfileComplete: true 
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                isProfileComplete: user.isProfileComplete,
                name: user.name,
                email: user.email,
                purpose: user.purpose,
                subscriptionStatus: user.subscriptionStatus
            }
        });
    } catch (error) {
        console.error('Error in setupProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { phoneNumber } = req.query;
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
