# Controllers Documentation

## Overview

Controllers handle the business logic for API endpoints. They use `express-async-handler` for error handling and follow a higher-order function pattern for reusability between User and Admin models.

## Authentication Controllers

### Registration Controller

**File:** `src/controllers/usercontrollers/Registration.controller.js`

**Function:** `Registration(Model)`

**Purpose:** Register a new user or admin account with OTP verification.

**Process:**

1. Validate request body using Zod schema
2. Check if user already exists
3. Hash password with Argon2
4. Generate and hash OTP
5. Create user document with OTP and expiration
6. Send OTP email
7. Return user info

**Parameters:**

- `Model`: Mongoose model (User or Admin)

**Request Body:**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "userInfo": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Error Cases:**

- Invalid input data
- User already exists
- Email sending failure (deletes created user)

### Login Controller

**File:** `src/controllers/usercontrollers/Login.controller.js`

**Function:** `Login(Model)`

**Purpose:** Authenticate a user and issue JWT tokens.

**Process:**

1. Validate request body
2. Find user by email
3. Check if account is verified
4. Verify password hash
5. Generate access and refresh tokens
6. Update user's refresh token in database
7. Set HTTP-only cookies
8. Return user info

**Parameters:**

- `Model`: Mongoose model (User or Admin)

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "userInfo": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Cookies Set:**

- `accessToken`: 10 minutes
- `refreshToken`: 7 days

**Error Cases:**

- Invalid credentials
- Account not verified

### Logout Controller

**File:** `src/controllers/usercontrollers/Logout.controllers.js`

**Function:** `logout(Model)`

**Purpose:** Log out a user by clearing tokens.

**Process:**

1. Get refresh token from cookies
2. Find user and clear refresh token in database
3. Clear both token cookies

**Parameters:**

- `Model`: Mongoose model (User or Admin)

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token Controller

**File:** `src/controllers/authentication/refresh.contollers.js`

**Function:** `refreshToken(Model)`

**Purpose:** Issue new tokens using a valid refresh token.

**Process:**

1. Get refresh token from cookies
2. Verify refresh token
3. Find user and validate token matches stored token
4. Generate new access and refresh tokens
5. Update user's refresh token in database
6. Set new token cookies

**Parameters:**

- `Model`: Mongoose model (User or Admin)

**Response:**

```json
{
  "success": true,
  "message": "Access token refreshed"
}
```

**Error Cases:**

- Missing refresh token
- Invalid refresh token
- Token mismatch

## OTP Verification Controller

**File:** `src/utils/security/verifyOtp.js`

**Function:** `verifyOtp(Model, role)`

**Purpose:** Verify user account with OTP and complete registration.

**Process:**

1. Validate OTP and email
2. Find user by email
3. Check user role matches expected role
4. Verify OTP hasn't expired
5. Generate JWT tokens
6. Update user: set verified, clear OTP fields, set refresh token
7. Set token cookies

**Parameters:**

- `Model`: Mongoose model (User or Admin)
- `role`: Expected role ("student" or "admin")

**Request Body:**

```json
{
  "email": "string",
  "otp": "string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account verified successfully"
}
```

**Error Cases:**

- Invalid OTP format
- User not found
- Wrong role
- OTP expired

## Controller Patterns

### Higher-Order Functions

Most controllers use higher-order functions that accept a Model parameter, allowing the same logic to be reused for both User and Admin authentication.

```javascript
const Login = (Model) => async (req, res) => {
  // Logic here uses the passed Model
};
```

### Error Handling

All controllers use `express-async-handler` to catch async errors:

```javascript
const controller = asyncHandler(async (req, res) => {
  // Controller logic
  if (errorCondition) {
    res.status(400);
    throw new Error("Error message");
  }
});
```

### Validation

Input validation is performed using Zod schemas before processing.

### Token Management

- Access tokens: 10 minutes, stored in `accessToken` cookie
- Refresh tokens: 7 days, stored in `refreshToken` cookie
- Both are HTTP-only, secure (in production), and same-site protected

### Cookie Settings

```javascript
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 10 * 60 * 1000, // 10 minutes
});
```

## Security Considerations

- Passwords are never logged or returned
- OTPs are hashed before storage
- Tokens are validated on each request
- Failed login attempts don't specify which credential is wrong
- Account verification is required before login
- Refresh tokens are rotated on each use

## Testing Controllers

To test controllers, you can use tools like Postman or curl:

```bash
# Register a user
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Verify OTP (replace 123456 with actual OTP)
curl -X POST http://localhost:5000/api/user/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}' \
  -b cookies.txt -c cookies.txt
```

## Future Enhancements

- Add rate limiting per user/IP
- Implement password reset functionality
- Add account lockout after failed attempts
- Implement session management
- Add two-factor authentication</content>
  <parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/Controllers.md
