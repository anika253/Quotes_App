exports.sendOtp = (req, res) => {
    const { phoneNumber } = req.body;
    console.log(`Sending OTP to ${phoneNumber}`);
    res.status(200).json({ message: 'OTP sent successfully', mockOtp: '123456' });
};

exports.verifyOtp = (req, res) => {
    const { phoneNumber, otp } = req.body;
    if (otp === '123456') {
        res.status(200).json({ 
            message: 'OTP verified', 
            token: 'mock-jwt-token',
            user: { phoneNumber, isProfileComplete: false }
        });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};
