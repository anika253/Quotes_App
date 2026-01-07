const User = require('../models/User');
const jwt = require('jsonwebtoken');

// In a real app, you'd use a service like Twilio to send actual OTPs.
// For this implementation, we'll simulate the OTP sending.
exports.sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        console.log(`Sending OTP to ${phoneNumber}`);
        // Mock OTP for demonstration
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

        // Professional verification logic
        if (otp === '123456') {
            // Find or create user in MongoDB
            let user = await User.findOne({ phoneNumber });
            
            if (!user) {
                user = new User({ phoneNumber });
                await user.save();
            }

            // Generate JWT token
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
