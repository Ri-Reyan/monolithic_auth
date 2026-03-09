# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT tokens for authentication. After login, tokens are set as HTTP-only cookies.

### Cookies

- `accessToken`: Short-lived token (10 minutes)
- `refreshToken`: Long-lived token (7 days) for refreshing access tokens

## User Endpoints

### User Registration

**POST** `/user/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "userInfo": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Validation Rules:**

- `name`: Required, 1-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### User Login

**POST** `/user/login`

Authenticate a user.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "userInfo": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

**Error Responses:**

- 400: Invalid email or password
- 403: Account not verified

### OTP Verification

**POST** `/user/verify-otp`

Verify user account with OTP sent to email.

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account verified successfully"
}
```

**Error Responses:**

- 400: Invalid OTP or expired
- 404: User not found

### User Logout

**POST** `/user/logout`

Log out the current user.

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Refresh Token

**POST** `/user/refresh-token`

Refresh the access token using the refresh token.

**Response (200):**

```json
{
  "success": true,
  "message": "Access token refreshed"
}
```

## Admin Endpoints

Admin endpoints follow the same structure as user endpoints but with `/admin` prefix.

### Admin Registration

**POST** `/admin/register`

Same as user registration but creates an admin account.

### Admin Login

**POST** `/admin/login`

Same as user login but for admin accounts.

### Admin OTP Verification

**POST** `/admin/verify-otp`

Same as user OTP verification but for admin accounts.

### Admin Logout

**POST** `/admin/logout`

Same as user logout.

### Admin Refresh Token

**POST** `/admin/refresh-token`

Same as user refresh token.

## Error Handling

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Common HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (account not verified, invalid role)
- 404: Not Found
- 409: Conflict (user already exists)
- 500: Internal Server Error

## Rate Limiting

- Global limit: 100 requests per 15 minutes
- In production: 50 requests per 15 minutes
- Applies to all endpoints

## Security

- All sensitive routes require authentication
- Passwords are hashed with Argon2
- OTPs are hashed before storage
- Tokens are HTTP-only cookies
- CORS is configured for security
- Security headers are set via Helmet

## Content Management

_Note: Content management endpoints are not fully implemented in the current codebase but the models and validations exist._

### Course Model

```json
{
  "title": "Course Title",
  "description": "Course description",
  "price": 99.99,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "instructor": "Instructor Name",
  "category": "Technology",
  "studentsEnrolled": 0
}
```

### Validation Rules for Course Creation

- `title`: 5-100 characters
- `description`: Minimum 10 characters
- `price`: Positive number
- `thumbnail`: Valid URL
- `instructor`: 3-50 characters
- `category`: 3-50 characters</content>
  <parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/API.md
