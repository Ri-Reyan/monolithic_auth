# Middleware Documentation

## Overview

Middleware functions handle cross-cutting concerns like authentication, security, and error handling. They are executed in the order they are registered in the Express app.

## Authentication Middleware

### Protect Middleware

**File:** `src/middleware/authorization/auth.middleware.js`

**Function:** `protect`

**Purpose:** Verify JWT access tokens for protected routes.

**Process:**

1. Extract `accessToken` from cookies
2. If no token, return 401 error
3. Verify token with JWT_ACCESS_SECRET
4. If invalid, return 401 error
5. Set `req.userId` to the decoded user ID
6. Call `next()` to continue to next middleware

**Usage:**

```javascript
import protect from "./middleware/authorization/auth.middleware.js";

// In routes
router.get("/protected", protect, (req, res) => {
  // req.userId is available here
  res.json({ userId: req.userId });
});
```

**Error Responses:**

- 401: "Access token missing"
- 401: "Invalid or expired access token"

## Error Handling Middleware

### Error Handler

**File:** `src/middleware/error-middleware/errorHandler.middleware.js`

**Function:** `errorHandler`

**Purpose:** Centralized error handling for the Express application.

**Process:**

1. Set status code to 500 if response is still 200
2. Return JSON error response with success: false and error message

**Usage:**
This middleware must be registered last in the middleware chain:

```javascript
// In app.js
app.use(errorHandler); // Always last
```

**Response Format:**

```json
{
  "success": false,
  "message": "Error message from thrown Error"
}
```

## Application-Level Middleware

### Express Built-in Middleware

**File:** `app.js`

**Registered Middleware:**

1. **JSON Parser:**

   ```javascript
   app.use(express.json());
   ```

   Parses incoming JSON payloads.

2. **URL-encoded Parser:**

   ```javascript
   app.use(express.urlencoded({ extended: true }));
   ```

   Parses URL-encoded payloads.

3. **Cookie Parser:**
   ```javascript
   app.use(cookiesParser());
   ```
   Parses cookies from requests.

### Third-Party Middleware

1. **CORS:**

   ```javascript
   app.use(
     cors({
       origin: allowedOrigin ? allowedOrigin : true,
       credentials: true,
     }),
   );
   ```

   Enables Cross-Origin Resource Sharing.

2. **Helmet:**

   ```javascript
   app.use(helmet());
   ```

   Sets various HTTP security headers.

3. **Rate Limiting:**
   ```javascript
   const limiter = {
     windowMs: 15 * 60 * 1000, // 15 minutes
     limit: process.env.NODE_ENV === "production" ? 50 : 100,
     standardHeaders: true,
     legacyHeaders: false,
   };
   app.use(rateLimit(limiter));
   ```
   Limits requests to prevent abuse.

## Middleware Order

The middleware execution order in `app.js` is crucial:

```javascript
// 1. Security middleware (helmet, cors)
// 2. Rate limiting
// 3. Body parsing (json, urlencoded)
// 4. Cookie parsing
// 5. Route handlers
// 6. Error handler (last)
```

## Security Headers (Helmet)

Helmet sets the following security headers:

- `Content-Security-Policy`: Prevents XSS attacks
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Strict-Transport-Security`: Enforces HTTPS
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

## Rate Limiting

**Configuration:**

- Window: 15 minutes
- Limit: 100 requests (50 in production)
- Uses standard headers for rate limit info

**Headers Added:**

- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

## CORS Configuration

**Settings:**

- `origin`: Configurable via `CORS_ORIGIN` env var
- `credentials`: true (allows cookies)

If `CORS_ORIGIN` is set, only that origin is allowed. Otherwise, all origins are permitted.

## Custom Middleware Development

When creating custom middleware:

```javascript
const customMiddleware = (req, res, next) => {
  // Middleware logic
  try {
    // Do something
    next(); // Continue to next middleware
  } catch (error) {
    next(error); // Pass error to error handler
  }
};
```

## Error Propagation

Errors thrown in middleware or route handlers are caught by the error handler:

```javascript
// In any middleware or route
if (someCondition) {
  const error = new Error("Something went wrong");
  error.statusCode = 400; // Optional custom status
  throw error;
}
```

## Testing Middleware

### Testing Authentication:

```bash
# Without token
curl http://localhost:5000/api/protected
# Returns 401

# With valid token (from login)
curl http://localhost:5000/api/protected -b cookies.txt
# Returns protected data
```

### Testing Rate Limiting:

```bash
# Make multiple requests quickly
for i in {1..10}; do
  curl http://localhost:5000/api/user/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test'$i'@example.com","password":"pass"}'
done
```

## Future Middleware

Potential middleware to add:

- Request logging
- Request ID tracking
- User activity logging
- API versioning
- Compression
- Static file serving</content>
  <parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/Middleware.md
