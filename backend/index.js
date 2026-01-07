const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./src/middleware/logger');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const quoteRoutes = require('./src/routes/quoteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/quotes', quoteRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Quotes App Backend is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
