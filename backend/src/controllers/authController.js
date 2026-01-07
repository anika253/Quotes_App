const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');

exports.sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // For testing/demo purposes, we'll still use '123456' if you prefer, 
        // but let's make it dynamic and store it in DB.
        // If you want to keep it '123456' for now, uncomment the next line:
        // const otp = '123456';

        // Save OTP to MongoDB (will overwrite any existing OTP for this number)
        await Otp.findOneAndUpdate(
            { phoneNumber },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        console.log(`OTP for ${phoneNumber} is ${otp}`);
        
        // In production, send SMS here. For now, return it in response for testing.
        res.status(200).json({ 
            message: 'OTP sent successfully', 
            mockOtp: otp // Remove this in production
        });
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

        // Find the OTP in MongoDB
        const otpRecord = await Otp.findOne({ phoneNumber, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid, delete it from DB
        await Otp.deleteOne({ _id: otpRecord._id });

        // Find or create user in MongoDB
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
