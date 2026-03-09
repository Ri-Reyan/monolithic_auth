# Authentication Backend Documentation

## Overview

A secure auth system backend built with Node.js, Express.js, and MongoDB. It provides authentication features for both users (students) and administrators.

## Features

- User and Admin Authentication (Registration, Login, Logout)
- Email OTP Verification
- JWT-based Token Authentication with Refresh Tokens
- Password Hashing with Argon2
- Rate Limiting and Security Headers
- CORS Support

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: Argon2
- **Email Service**: Nodemailer with Gmail
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Other**: Cookie Parser

## Project Structure

```
backend/
├── app.js                 # Main Express app setup
├── server.js              # Server entry point
├── package.json           # Dependencies and scripts
├── docs/                  # Documentation
└── src/
    ├── config/
    │   └── db/
    │       └── dbConnection.js  # MongoDB connection
    ├── controllers/
    │   ├── authentication/
    │   │   └── refresh.contollers.js  # Token refresh
    │   └── usercontrollers/
    │       ├── Login.controller.js
    │       ├── Logout.controllers.js
    │       └── Registration.controller.js
    ├── middleware/
    │   ├── authorization/
    │   │   └── auth.middleware.js  # JWT authentication
    │   └── error-middleware/
    │       └── errorHandler.middleware.js  # Error handling
    ├── models/
    │   ├── adminSchema/
    │   │   └── admin.model.js
    │   ├── contentSchema/
    │   │   └── course.model.js
    │   └── userSchema/
    │       └── user.model.js
    ├── routes/
    │   ├── adminRoutes/
    │   │   └── adminAuthRoutes.js
    │   └── userRoutes/
    │       └── userAuthRoutes.js
    ├── services/
    │   └── mail/
    │       └── sendEmail.js
    ├── utils/
    │   ├── security/
    │   │   ├── argon.js       # Password hashing
    │   │   ├── otp.js         # OTP generation/hashing
    │   │   └── verifyOtp.js   # OTP verification
    │   └── token/
    │       └── genToken.js    # JWT token generation
    └── validations/
        ├── auth/
        │   └── auth.validator.js
        └── content/
            └── content.validator.js
```

## Installation

1. Clone the repository and navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root with the following variables:

   ```
   MONGO_URI=mongodb://localhost:27017/aspirex
   JWT_ACCESS_SECRET=your_access_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CORS_ORIGIN=http://localhost:5173 // react frontend URL
   PORT=5000
   NODE_ENV=development
   PASSWORD_PEPPER=your_pepper_string
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable           | Description                          | Required                          |
| ------------------ | ------------------------------------ | --------------------------------- |
| MONGO_URI          | MongoDB connection string            | Yes                               |
| JWT_ACCESS_SECRET  | Secret key for access tokens         | Yes                               |
| JWT_REFRESH_SECRET | Secret key for refresh tokens        | Yes                               |
| EMAIL_USER         | Gmail address for sending emails     | Yes                               |
| EMAIL_PASS         | Gmail app password                   | Yes                               |
| CORS_ORIGIN        | Allowed CORS origin                  | No (defaults to allow all)        |
| PORT               | Server port                          | No (defaults to 3000)             |
| NODE_ENV           | Environment (production/development) | No                                |
| PASSWORD_PEPPER    | Pepper for password hashing          | No (defaults to "default_pepper") |

## API Endpoints

See [API Documentation](./API.md) for detailed endpoint information.

## Security Features

- **Password Hashing**: Argon2 with configurable parameters and pepper
- **JWT Tokens**: Short-lived access tokens (10 minutes) with refresh tokens (7 days)
- **Rate Limiting**: 100 requests per 15 minutes (50 in production)
- **Security Headers**: Helmet for setting various HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **OTP Verification**: 6-digit OTP with 10-minute expiration
- **Input Validation**: Zod schemas for request validation

## Database Models

### User Model

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (default: "student")
- `otp`: String (hashed)
- `otpExpires`: Date
- `isVerified`: Boolean (default: false)
- `refreshToken`: String
- `timestamps`: true

### Admin Model

- Same as User model but with `role` default: "admin"

### Course Model

- `title`: String (required, 5-100 chars)
- `description`: String (required)
- `price`: Number (required, positive)
- `thumbnail`: String (required, URL)
- `videoUrl`: String (required)
- `instructor`: String (required)
- `category`: String (required)
- `studentsEnrolled`: Number (default: 0)
- `timestamps`: true

## Contributing

1. Follow the existing code structure
2. Use ES modules (import/export)
3. Implement proper error handling with asyncHandler
4. Validate inputs with Zod schemas
5. Write clear, concise code with comments where necessary

## License

REYAN
