const Payment = require('../models/Payment');
const User = require('../models/User');

// Mock Payment Gateway Response
const mockPaymentGateway = {
    initiatePayment: (amount, plan) => {
        // Simulate payment gateway response
        return {
            paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            amount,
            plan,
            gatewayTransactionId: `TXN_${Date.now()}`,
            status: 'pending',
            createdAt: new Date(),
        };
    },
    
    verifyPayment: (paymentId) => {
        // Mock successful payment verification (90% success rate)
        const isSuccess = Math.random() > 0.1;
        return {
            paymentId,
            status: isSuccess ? 'completed' : 'failed',
            transactionId: `TXN_${Date.now()}`,
            message: isSuccess ? 'Payment successful' : 'Payment failed',
        };
    },
};

// Initiate Payment (Mock API)
exports.initiatePayment = async (req, res) => {
    try {
        const { amount, plan } = req.body;
        const userId = req.userData.userId;

        if (!amount || !plan) {
            return res.status(400).json({ message: 'Amount and plan are required' });
        }

        // Mock payment gateway call
        const mockResponse = mockPaymentGateway.initiatePayment(amount, plan);

        // Save payment record to database
        const payment = new Payment({
            userId,
            amount,
            plan,
            paymentId: mockResponse.paymentId,
            gatewayTransactionId: mockResponse.gatewayTransactionId,
            status: 'pending',
        });

        await payment.save();

        // Return mock API response
        res.status(200).json({
            message: 'Payment initiated successfully',
            paymentId: payment._id.toString(),
            gatewayPaymentId: mockResponse.paymentId,
            gatewayTransactionId: mockResponse.gatewayTransactionId,
            amount,
            plan,
            status: 'pending',
            redirectUrl: `https://mock-payment-gateway.com/pay/${mockResponse.paymentId}`, // Mock redirect URL
        });
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify Payment (Mock API)
exports.verifyPayment = async (req, res) => {
    try {
        const { paymentId } = req.body;
        
        if (!paymentId) {
            return res.status(400).json({ message: 'Payment ID is required' });
        }

        // Find payment record
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        // Mock payment gateway verification
        const mockVerification = mockPaymentGateway.verifyPayment(payment.gatewayTransactionId);

        // Update payment status
        payment.status = mockVerification.status;
        payment.transactionId = mockVerification.transactionId;
        await payment.save();

        // If payment successful, upgrade user to pro
        if (payment.status === 'completed') {
            await User.findByIdAndUpdate(payment.userId, { 
                subscriptionStatus: 'pro',
                updatedAt: new Date(),
            });
        }

        // Return mock API response
        res.status(200).json({
            message: mockVerification.message,
            status: payment.status,
            paymentId: payment._id.toString(),
            transactionId: mockVerification.transactionId,
            amount: payment.amount,
            plan: payment.plan,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Payment Status (Mock API)
exports.getPaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.status(200).json({
            paymentId: payment._id.toString(),
            status: payment.status,
            amount: payment.amount,
            plan: payment.plan,
            gatewayTransactionId: payment.gatewayTransactionId,
            createdAt: payment.createdAt,
        });
    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
