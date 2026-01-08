require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("./src/middleware/logger");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const quoteRoutes = require("./src/routes/quoteRoutes");
const downloadRoutes = require("./src/routes/downloadRoutes");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(logger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/downloads", downloadRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Quotes App Backend is running...",
    endpoints: {
      auth: "/api/auth/signup, /api/auth/login, /api/auth/check-auth",
      profile: "/api/profile/setup, /api/profile/get",
      payment: "/api/payment/initiate, /api/payment/verify",
      quotes: "/api/quotes, /api/quotes/categories",
      downloads: "/api/downloads/save, /api/downloads/history"
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    path: req.path,
    method: req.method
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method,
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: {
      auth: "/api/auth/signup, /api/auth/login, /api/auth/check-auth",
      profile: "/api/profile/setup, /api/profile/get",
      payment: "/api/payment/initiate, /api/payment/verify",
      quotes: "/api/quotes, /api/quotes/categories",
      downloads: "/api/downloads/save, /api/downloads/history"
    }
  });
});

const startServer = async () => {
  try {
    // Try to connect to MongoDB, but don't block server start
    connectDB().catch((err) => {
      console.warn("⚠️  MongoDB connection warning:", err.message);
      console.warn("⚠️  Server will continue without database connection (some features may not work)");
    });
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log("\n✅ Server is running on port", PORT);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 Auth signup: http://localhost:${PORT}/api/auth/signup`);
      console.log(`📍 Auth login: http://localhost:${PORT}/api/auth/login`);
      console.log(`📍 API base URL: http://localhost:${PORT}/api`);
      console.log("\n");
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please stop the other server or use a different port.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
