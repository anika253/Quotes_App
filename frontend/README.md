# Quotes App - Full Stack Setup

This project consists of a React frontend and a Node.js/Express backend refactored into an MVC structure.

## Project Structure

```text
Quotes_App/
├── backend/                # Node.js Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Custom middleware (logger, etc.)
│   │   └── models/         # Data models (mocked)
│   └── index.js            # Server entry point
├── src/                    # React Frontend
│   ├── api.js              # API utility for backend communication
│   └── ...
└── ...
```

## Installation & Setup

### 1. Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node index.js
   ```
   The server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate back to the root directory:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The app will be available at the URL provided by Vite (usually `http://localhost:5173`).

## Features Integrated with Backend
- **OTP Auth**: Mock flow using `123456` as the verification code.
- **Profile Setup**: Saves user/business details to the backend.
- **Premium Upgrade**: Mock payment initiation and verification flow.
- **Categories**: Fetched dynamically from the backend.

## API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/send-otp` | POST | Sends mock OTP |
| `/api/auth/verify-otp` | POST | Verifies OTP (use `123456`) |
| `/api/profile/setup` | POST | Saves profile details |
| `/api/payment/initiate` | POST | Starts payment flow |
| `/api/payment/verify` | POST | Completes payment flow |
| `/api/quotes/categories` | GET | Gets quote categories |
