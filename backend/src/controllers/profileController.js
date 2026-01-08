const User = require('../models/User');

exports.setupProfile = async (req, res) => {
    try {
        const { name, email, purpose, userImage, showDate } = req.body;
        const userId = req.userData.userId;

        const updateData = { 
            isProfileComplete: true,
            updatedAt: new Date()
        };

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (purpose !== undefined) updateData.purpose = purpose;
        if (userImage !== undefined) updateData.userImage = userImage;
        if (showDate !== undefined) updateData.showDate = showDate;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user: {
                id: user._id,
                email: user.email,
                isProfileComplete: user.isProfileComplete,
                name: user.name,
                userImage: user.userImage,
                purpose: user.purpose,
                subscriptionStatus: user.subscriptionStatus,
                showDate: user.showDate
            }
        });
    } catch (error) {
        console.error('Error in setupProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userImage: user.userImage,
                purpose: user.purpose,
                subscriptionStatus: user.subscriptionStatus,
                isProfileComplete: user.isProfileComplete,
                showDate: user.showDate
            }
        });
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
