# API Routes Documentation

## Authentication Routes (`/api/auth`)

### POST /api/auth/signup
Register a new user with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": null,
    "purpose": null,
    "subscriptionStatus": "free",
    "isProfileComplete": false
  }
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "purpose": "personal",
    "subscriptionStatus": "free",
    "isProfileComplete": true
  }
}
```

### GET /api/auth/check-auth
Check authentication status (requires JWT token in Authorization header).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "purpose": "personal",
    "subscriptionStatus": "free",
    "isProfileComplete": true
  }
}
```

## Profile Routes (`/api/profile`)

### POST /api/profile/setup
Setup user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "purpose": "personal"
}
```

### GET /api/profile/get
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## Payment Routes (`/api/payment`)

### POST /api/payment/initiate
Initiate a mock payment (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "amount": 199,
  "plan": "monthly"
}
```

### POST /api/payment/verify
Verify a mock payment (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "paymentId": "payment_id_here"
}
```

### GET /api/payment/status/:paymentId
Get payment status (requires authentication).

## Health Check

### GET /health
Check if server is running.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

