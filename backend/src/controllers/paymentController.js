const payments = [];

exports.initiatePayment = (req, res) => {
    const { userId, planId, amount } = req.body;
    const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
    payments.push({ paymentId, userId, planId, amount, status: 'pending' });
    res.status(200).json({ 
        message: 'Payment initiated', 
        paymentId,
        checkoutUrl: `https://mock-payment-gateway.com/pay/${paymentId}`
    });
};

exports.verifyPayment = (req, res) => {
    const { paymentId } = req.body;
    const payment = payments.find(p => p.paymentId === paymentId);
    if (payment) {
        payment.status = 'success';
        res.status(200).json({ message: 'Payment verified successfully', status: 'success' });
    } else {
        res.status(404).json({ message: 'Payment not found' });
    }
};
