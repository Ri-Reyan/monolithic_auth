# Routes Documentation

## Overview

Routes define the API endpoints and connect them to their respective controllers. The application uses separate route files for user and admin authentication.

## Route Structure

```
routes/
├── userRoutes/
│   └── userAuthRoutes.js    # User authentication endpoints
└── adminRoutes/
    └── adminAuthRoutes.js   # Admin authentication endpoints
```

## User Authentication Routes

**File:** `src/routes/userRoutes/userAuthRoutes.js`

**Base Path:** `/api/user`

**Routes:**

### POST `/register`

- **Controller:** `Registration(User)`
- **Purpose:** Register a new user account
- **Middleware:** None
- **Body:** `{ name, email, password }`

### POST `/login`

- **Controller:** `Login(User)`
- **Purpose:** Authenticate user
- **Middleware:** None
- **Body:** `{ email, password }`

### POST `/logout`

- **Controller:** `logout(User)`
- **Purpose:** Log out user
- **Middleware:** None (uses cookies)

### POST `/refresh-token`

- **Controller:** `refreshToken(User)`
- **Purpose:** Refresh access token
- **Middleware:** None (uses cookies)

### POST `/verify-otp`

- **Controller:** `verifyOtp(User, "student")`
- **Purpose:** Verify user account with OTP
- **Middleware:** None
- **Body:** `{ email, otp }`

## Admin Authentication Routes

**File:** `src/routes/adminRoutes/adminAuthRoutes.js`

**Base Path:** `/api/admin`

**Routes:** Identical to user routes but use Admin model

### POST `/register`

- **Controller:** `Registration(Admin)`
- **Purpose:** Register a new admin account

### POST `/login`

- **Controller:** `Login(Admin)`
- **Purpose:** Authenticate admin

### POST `/logout`

- **Controller:** `logout(Admin)`
- **Purpose:** Log out admin

### POST `/refresh-token`

- **Controller:** `refreshToken(Admin)`
- **Purpose:** Refresh admin access token

### POST `/verify-otp`

- **Controller:** `verifyOtp(Admin, "admin")`
- **Purpose:** Verify admin account with OTP

## Route Registration

**File:** `app.js`

Routes are registered in the main application:

```javascript
import userAuthRoutes from "./src/routes/userRoutes/userAuthRoutes.js";
import adminAuthRoutes from "./src/routes/adminRoutes/adminAuthRoutes.js";

app.use("/api/user", userAuthRoutes);
app.use("/api/admin", adminAuthRoutes);
```

## Route Patterns

### Higher-Order Controllers

All authentication controllers follow the higher-order function pattern:

```javascript
const Login = (Model) =>
  asyncHandler(async (req, res) => {
    // Controller logic using Model
  });
```

This allows the same controller logic to be reused for both User and Admin models.

### Role-Based Routing

- User routes use the User model and expect "student" role
- Admin routes use the Admin model and expect "admin" role

### Cookie-Based Authentication

Several routes rely on HTTP-only cookies:

- `/logout`: Reads `refreshToken` cookie
- `/refresh-token`: Reads `refreshToken` cookie, sets new tokens

## Middleware Integration

While the current routes don't use authentication middleware, they are designed to work with it:

```javascript
// Example of protected route (not implemented)
import protect from "../middleware/authorization/auth.middleware.js";

router.get("/profile", protect, (req, res) => {
  // req.userId available
});
```

## Error Handling

Routes rely on:

1. **Controller Error Handling:** Controllers throw errors with appropriate status codes
2. **Global Error Handler:** Catches all errors and returns consistent JSON responses

## Future Route Expansions

### Content Management Routes

```javascript
// Potential course routes
router.post("/courses", protect, createCourse);
router.get("/courses", getCourses);
router.get("/courses/:id", getCourse);
router.put("/courses/:id", protect, updateCourse);
router.delete("/courses/:id", protect, deleteCourse);
```

### User Profile Routes

```javascript
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);
```

### Admin Routes

```javascript
router.get("/users", protect, getAllUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);
```

## Route Testing

### Testing User Registration

```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Testing User Login

```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

### Testing OTP Verification

```bash
# Replace 123456 with actual OTP from email
curl -X POST http://localhost:5000/api/user/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456"
  }'
```

### Testing Logout

```bash
curl -X POST http://localhost:5000/api/user/logout \
  -b cookies.txt
```

## Security Considerations

1. **Input Validation:** All routes use Zod schemas for input validation
2. **Rate Limiting:** Applied globally at the application level
3. **CORS:** Configured to allow specific origins
4. **HTTPS Only:** Tokens marked secure in production
5. **HTTP-Only Cookies:** Prevent XSS attacks

## API Versioning

Current routes don't include versioning, but can be extended:

```javascript
// Versioned routes
app.use("/api/v1/user", userAuthRoutes);
app.use("/api/v1/admin", adminAuthRoutes);
```

## Route Organization Best Practices

1. **Separation of Concerns:** Auth routes separate from content routes
2. **Role-Based Access:** Clear separation between user and admin routes
3. **Consistent Naming:** RESTful endpoint naming
4. **Middleware Usage:** Authentication middleware ready for protected routes
5. **Error Consistency:** Uniform error responses across all routes</content>
   <parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/Routes.md
