const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        console.log(`Sending OTP to ${phoneNumber}`);
        res.status(200).json({ message: 'OTP sent successfully', mockOtp: '123456' });
    } catch (error) {
        console.error('Error in sendOtp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        
        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        if (otp === '123456') {
            // Use findOneAndUpdate with upsert to avoid race conditions and duplicate key errors
            const user = await User.findOneAndUpdate(
                { phoneNumber },
                { $setOnInsert: { phoneNumber } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            const token = jwt.sign(
                { userId: user._id, phoneNumber: user.phoneNumber },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(200).json({ 
                message: 'OTP verified successfully', 
                token,
                user: {
                    id: user._id,
                    phoneNumber: user.phoneNumber,
                    isProfileComplete: user.isProfileComplete,
                    name: user.name,
                    email: user.email,
                    subscriptionStatus: user.subscriptionStatus
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                isProfileComplete: user.isProfileComplete,
                name: user.name,
                email: user.email,
                subscriptionStatus: user.subscriptionStatus
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
