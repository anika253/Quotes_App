const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// User Signup
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            subscriptionStatus: 'free',
            isProfileComplete: false,
        });
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userImage: user.userImage,
                purpose: user.purpose,
                subscriptionStatus: user.subscriptionStatus,
                isProfileComplete: user.isProfileComplete,
                showDate: user.showDate,
            },
        });
    } catch (error) {
        console.error('Error in signup:', error);
        if (error.code === 11000) {
            // Check if it's an email duplicate or phoneNumber index issue
            if (error.keyPattern && error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already exists' });
            } else if (error.keyPattern && error.keyPattern.phoneNumber) {
                // This is the old phoneNumber index issue - need to run migration
                return res.status(500).json({ 
                    message: 'Database configuration error. Please contact support or run database migration.' 
                });
            }
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user has a password (for old users without password)
        if (!user.password) {
            return res.status(401).json({ 
                message: 'Account needs to be reset. Please sign up again or contact support.' 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userImage: user.userImage,
                purpose: user.purpose,
                subscriptionStatus: user.subscriptionStatus,
                isProfileComplete: user.isProfileComplete,
                showDate: user.showDate,
            },
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Check authentication status
exports.checkAuth = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            authenticated: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                userImage: user.userImage,
                purpose: user.purpose,
                subscriptionStatus: user.subscriptionStatus,
                isProfileComplete: user.isProfileComplete,
                showDate: user.showDate,
            },
        });
    } catch (error) {
        console.error('Error in checkAuth:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
