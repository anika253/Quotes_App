const Payment = require('../models/Payment');
const User = require('../models/User');

exports.initiatePayment = async (req, res) => {
    try {
        const { amount, plan } = req.body;
        const userId = req.userData.userId;

        const payment = new Payment({
            userId,
            amount,
            plan,
            status: 'pending'
        });

        await payment.save();

        res.status(200).json({ 
            message: 'Payment initiated', 
            paymentId: payment._id,
            amount 
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { paymentId, status } = req.body;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        payment.status = status || 'completed';
        await payment.save();

        if (payment.status === 'completed') {
            await User.findByIdAndUpdate(payment.userId, { subscriptionStatus: 'pro' });
        }

        res.status(200).json({ message: 'Payment verified', status: payment.status });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
