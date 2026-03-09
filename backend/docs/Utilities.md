# Utilities Documentation

## Overview

Utility functions provide reusable functionality for security, token management, and other common operations.

## Security Utilities

### Password Hashing (Argon2)

**File:** `src/utils/security/argon.js`

**Configuration:**

```javascript
const options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 5,
  parallelism: 1,
};
```

**Functions:**

#### `createHash(password)`

Hashes a password with Argon2 and a pepper.

**Parameters:**

- `password`: Plain text password

**Returns:** Hashed password string

**Usage:**

```javascript
const hashedPassword = await createHash("userPassword");
```

#### `verifyHash(hashedPassword, password)`

Verifies a password against its hash.

**Parameters:**

- `hashedPassword`: Previously hashed password
- `password`: Plain text password to verify

**Returns:** Boolean - true if password matches

**Usage:**

```javascript
const isValid = await verifyHash(storedHash, "userPassword");
```

**Security Notes:**

- Uses Argon2id variant (resistant to side-channel attacks)
- Includes a pepper from environment variable `PASSWORD_PEPPER`
- Configurable memory and time costs for security vs performance balance

### OTP Generation and Hashing

**File:** `src/utils/security/otp.js`

**Functions:**

#### `genOtp()`

Generates a 6-digit numeric OTP.

**Returns:** String - 6-digit OTP

**Usage:**

```javascript
const otp = genOtp(); // e.g., "123456"
```

#### `hashedOtp(otp)`

Hashes an OTP using SHA-256.

**Parameters:**

- `otp`: Plain text OTP

**Returns:** Hex string hash

**Usage:**

```javascript
const hashed = hashedOtp("123456");
```

**Security Notes:**

- OTPs are hashed before storage in database
- SHA-256 provides one-way hashing
- Original OTP cannot be recovered from hash

### OTP Verification

**File:** `src/utils/security/verifyOtp.js`

**Function:** `verifyOtp(Model, role)`

This is both a utility and a controller that handles OTP verification.

**Process:**

1. Validates OTP format (6 digits)
2. Finds user by email
3. Checks role authorization
4. Verifies OTP hasn't expired
5. Compares hashed OTP
6. On success: marks user verified, clears OTP fields, generates tokens

**Parameters:**

- `Model`: User or Admin model
- `role`: Expected role ("student" or "admin")

**Usage:**

```javascript
// In routes
router.post("/verify-otp", verifyOtp(User, "student"));
```

## Token Utilities

**File:** `src/utils/token/genToken.js`

**Functions:**

#### `genAccessToken(userId)`

Generates a short-lived JWT access token.

**Parameters:**

- `userId`: User ID to encode

**Returns:** JWT token string

**Token Details:**

- Expires: 10 minutes
- Secret: `JWT_ACCESS_SECRET`

#### `genRefreshToken(userId)`

Generates a long-lived JWT refresh token.

**Parameters:**

- `userId`: User ID to encode

**Returns:** JWT token string

**Token Details:**

- Expires: 7 days
- Secret: `JWT_REFRESH_SECRET`

**Usage:**

```javascript
const accessToken = genAccessToken(user._id);
const refreshToken = genRefreshToken(user._id);
```

**Security Notes:**

- Access tokens are short-lived for security
- Refresh tokens are long-lived but rotated on use
- Tokens include user ID in payload

## Email Service

**File:** `src/services/mail/sendEmail.js`

**Function:** `sendEmail(email, otp, Model)`

Sends OTP verification email via Gmail.

**Parameters:**

- `email`: Recipient email address
- `otp`: Plain text OTP to send
- `Model`: User model (for cleanup on failure)

**Process:**

1. Validates email and OTP
2. Configures Gmail transporter
3. Sends HTML email with OTP
4. On failure: deletes user account and throws error

**Email Template:**

```html
<p>Dear User,</p>
<p>Your OTP for account verification is: <strong>${otp}</strong></p>
<p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
<p>Best regards,<br />AspireX Team</p>
```

**Configuration:**

- Service: Gmail
- Auth: Uses `EMAIL_USER` and `EMAIL_PASS` environment variables
- SMTP: smtp.gmail.com:587

**Error Handling:**
If email fails to send, the user account is automatically deleted to prevent spam registrations.

## Validation Schemas

### Authentication Validation

**File:** `src/validations/auth/auth.validator.js`

**Schemas:**

#### `LoginSchema`

```javascript
z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(6),
});
```

#### `RegisterSchema`

Extends `LoginSchema` with name field:

```javascript
LoginSchema.extend({
  name: z.string().min(1).max(50),
});
```

**Validation Rules:**

- Email: Required, valid format, converted to lowercase
- Password: Minimum 6 characters
- Name: 1-50 characters

### Content Validation

**File:** `src/validations/content/content.validator.js`

**Schema:** `createContentSchema`

```javascript
zod.object({
  title: zod.string().min(5).max(100),
  description: zod.string().min(10),
  price: zod.number().positive(),
  thumbnail: zod.string().url(),
  instructor: zod.string().min(3).max(50),
  category: zod.string().min(3).max(50),
});
```

**Validation Rules:**

- Title: 5-100 characters
- Description: Minimum 10 characters
- Price: Positive number
- Thumbnail: Valid URL
- Instructor: 3-50 characters
- Category: 3-50 characters

## Usage Examples

### Complete User Registration Flow

```javascript
import { createHash } from "../utils/security/argon.js";
import { genOtp, hashedOtp } from "../utils/security/otp.js";
import sendEmail from "../services/mail/sendEmail.js";
import User from "../models/userSchema/user.model.js";

// 1. Hash password
const hashedPassword = await createHash(password);

// 2. Generate and hash OTP
const otp = genOtp();
const hashedOtpValue = hashedOtp(otp);

// 3. Create user
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  otp: hashedOtpValue,
  otpExpires: Date.now() + 10 * 60 * 1000,
});

// 4. Send email
await sendEmail(email, otp, User);
```

### Token Generation and Verification

```javascript
import jwt from "jsonwebtoken";
import { genAccessToken } from "../utils/token/genToken.js";

// Generate token
const token = genAccessToken(userId);

// Verify token (in middleware)
const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
console.log(decoded.id); // userId
```

## Security Best Practices

1. **Passwords:**
   - Always hash passwords, never store plain text
   - Use strong hashing algorithm (Argon2)
   - Include pepper for additional security

2. **OTPs:**
   - Hash OTPs before storing
   - Set reasonable expiration time (10 minutes)
   - Clear OTP fields after successful verification

3. **Tokens:**
   - Use short-lived access tokens
   - Rotate refresh tokens
   - Store tokens securely (HTTP-only cookies)

4. **Email:**
   - Use app passwords for Gmail
   - Handle email failures gracefully
   - Include clear instructions in email templates

## Environment Variables

Required environment variables for utilities:

- `PASSWORD_PEPPER`: Pepper for password hashing
- `JWT_ACCESS_SECRET`: Secret for access tokens
- `JWT_REFRESH_SECRET`: Secret for refresh tokens
- `EMAIL_USER`: Gmail address
- `EMAIL_PASS`: Gmail app password

## Testing Utilities

### Testing Password Hashing

```javascript
const hashed = await createHash("testpass");
const isValid = await verifyHash(hashed, "testpass");
console.log(isValid); // true
```

### Testing OTP Generation

```javascript
const otp = genOtp();
console.log(otp.length); // 6
console.log(/^\d{6}$/.test(otp)); // true
```

### Testing Token Generation

````javascript
const token = genAccessToken("user123");
const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
console.log(decoded.id); // "user123"
```</content>
<parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/Utilities.md
````
