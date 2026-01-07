const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock Database
let users = [];
let payments = [];

// Auth Endpoints
app.post('/api/auth/send-otp', (req, res) => {
    const { phoneNumber } = req.body;
    console.log(`Sending OTP to ${phoneNumber}`);
    res.status(200).json({ message: 'OTP sent successfully', mockOtp: '123456' });
});

app.post('/api/auth/verify-otp', (req, res) => {
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
});

// Profile Endpoints
app.post('/api/profile/setup', (req, res) => {
    const { phoneNumber, name, photo, type } = req.body;
    const newUser = { phoneNumber, name, photo, type, isPremium: false };
    users.push(newUser);
    res.status(200).json({ message: 'Profile setup successful', user: newUser });
});

// Payment Endpoints
app.post('/api/payment/initiate', (req, res) => {
    const { userId, planId, amount } = req.body;
    const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
    payments.push({ paymentId, userId, planId, amount, status: 'pending' });
    res.status(200).json({ 
        message: 'Payment initiated', 
        paymentId,
        checkoutUrl: `https://mock-payment-gateway.com/pay/${paymentId}`
    });
});

app.post('/api/payment/verify', (req, res) => {
    const { paymentId } = req.body;
    const payment = payments.find(p => p.paymentId === paymentId);
    if (payment) {
        payment.status = 'success';
        // Update user to premium
        const user = users.find(u => u.phoneNumber === payment.userId);
        if (user) user.isPremium = true;
        res.status(200).json({ message: 'Payment verified successfully', status: 'success' });
    } else {
        res.status(404).json({ message: 'Payment not found' });
    }
});

// Quotes Endpoints
app.get('/api/quotes', (req, res) => {
    const categories = ['Good Morning', 'Motivational', 'Shayari', 'Religious', 'Love', 'Festival'];
    res.status(200).json({ categories });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
