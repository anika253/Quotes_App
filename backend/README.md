# Quotes App Backend

This is an Express.js backend for the Quotes App built with MERN stack using MVC pattern. It provides authentication with email/password and mock payment API responses.

## Tech Stack
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- MVC Architecture Pattern

## Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. Start the server:
   ```bash
   npm run dev
   # or
   node index.js
   ```

The server will run on `http://localhost:5000`.

## Project Structure (MVC Pattern)

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── src/
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── paymentController.js
│   │   ├── profileController.js
│   │   └── ...
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Payment.js
│   │   └── ...
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── ...
│   └── middleware/        # Middleware functions
│       ├── auth.js
│       └── logger.js
├── index.js               # Server entry point
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Register a new user with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login`: Login with email and password
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/check-auth`: Check authentication status (requires JWT token)

### Profile
- `POST /api/profile/setup`: Setup user profile (requires auth)
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "purpose": "personal"
  }
  ```

- `GET /api/profile/get`: Get user profile (requires auth)

### Payment (Mock API)
- `POST /api/payment/initiate`: Initiate a mock payment (requires auth)
  ```json
  {
    "amount": 199,
    "plan": "monthly"
  }
  ```
  Returns mock payment gateway response with `paymentId`, `gatewayPaymentId`, and `redirectUrl`.

- `POST /api/payment/verify`: Verify a mock payment (requires auth)
  ```json
  {
    "paymentId": "payment_id_here"
  }
  ```
  Returns mock verification response (90% success rate for testing).

- `GET /api/payment/status/:paymentId`: Get payment status (requires auth)

### Quotes
- `GET /api/quotes`: Returns available quote categories.
- `GET /api/quotes/categories`: Get all quote categories.

### Downloads
- `POST /api/downloads/save`: Save download history (requires auth)
- `GET /api/downloads/history`: Get download history (requires auth)

## Mock Payment Gateway

The payment endpoints use a mock payment gateway that:
- Generates unique payment IDs and transaction IDs
- Simulates payment verification with ~90% success rate
- Automatically upgrades user subscription to 'pro' on successful payment
- Returns realistic payment gateway response structure

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are valid for 7 days and include `userId` and `email` in the payload.
