# Quotes App Backend

This is a simple Express.js backend for the Quotes App, providing mock API responses for authentication, profile setup, and payments.

## Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```

The server will run on `http://localhost:5000`.

## API Endpoints

### Auth
- `POST /api/auth/send-otp`: Sends a mock OTP to the provided phone number.
- `POST /api/auth/verify-otp`: Verifies the OTP (use `123456` for testing).

### Profile
- `POST /api/profile/setup`: Saves user profile details.

### Payment
- `POST /api/payment/initiate`: Initiates a mock payment flow.
- `POST /api/payment/verify`: Verifies a mock payment.

### Quotes
- `GET /api/quotes`: Returns available quote categories.
