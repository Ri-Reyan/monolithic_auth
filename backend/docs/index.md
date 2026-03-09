# AspireX Backend Documentation Index

Welcome to the comprehensive documentation for the AspireX backend. This index provides quick access to all documentation sections.

## 📋 Table of Contents

### [🏠 Main README](README.md)

- Project overview and features
- Tech stack and architecture
- Installation and setup
- Environment variables
- Security features

### [🔌 API Documentation](API.md)

- Complete API endpoint reference
- Request/response formats
- Authentication flow
- Error handling
- Rate limiting and security

### [🗄️ Database Models](Models.md)

- User and Admin schemas
- Course model structure
- Field descriptions and validation
- Usage examples and relationships

### [🎮 Controllers](Controllers.md)

- Authentication controllers (Login, Register, Logout)
- Token refresh functionality
- OTP verification process
- Error handling patterns
- Security considerations

### [🔧 Middleware](Middleware.md)

- Authentication middleware
- Error handling
- Security headers (Helmet)
- CORS configuration
- Rate limiting setup

### [🛠️ Utilities](Utilities.md)

- Password hashing (Argon2)
- OTP generation and verification
- JWT token management
- Email service configuration
- Input validation schemas

### [🛣️ Routes](Routes.md)

- Route organization
- User and admin endpoints
- Middleware integration
- Testing examples
- Future expansions

### [⚙️ Setup & Deployment](Setup.md)

- Local development setup
- Production deployment
- Environment configuration
- Security best practices
- Troubleshooting guide

## 🚀 Quick Start

1. **Read the [Main README](README.md)** for project overview
2. **Follow the [Setup Guide](Setup.md)** for installation
3. **Check the [API Documentation](API.md)** for endpoint usage
4. **Review [Models](Models.md)** for data structure understanding

## 📊 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Services      │
                       │   (Email, etc)  │
                       └─────────────────┘
```

## 🔐 Authentication Flow

1. **Registration**: User registers → OTP sent to email
2. **Verification**: User enters OTP → Account verified
3. **Login**: User logs in → JWT tokens issued
4. **Access**: Protected routes use access tokens
5. **Refresh**: Expired tokens refreshed using refresh tokens

## 📁 Project Structure

```
backend/
├── docs/                 # 📚 Documentation
├── src/
│   ├── config/          # ⚙️ Database configuration
│   ├── controllers/     # 🎮 Request handlers
│   ├── middleware/      # 🔧 Cross-cutting concerns
│   ├── models/          # 🗄️ Data schemas
│   ├── routes/          # 🛣️ API endpoints
│   ├── services/        # 📧 External services
│   └── utils/           # 🛠️ Helper functions
├── app.js               # 🚀 Express app setup
├── server.js            # 🌐 Server entry point
└── package.json         # 📦 Dependencies
```

## 🛡️ Security Features

- **Password Hashing**: Argon2 with pepper
- **JWT Tokens**: Short-lived access, refresh tokens
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Zod schemas
- **Security Headers**: Helmet protection
- **OTP Verification**: Email-based account verification

## 🧪 Testing

Use the provided curl commands in each documentation section to test endpoints:

```bash
# Example: Register a user
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'
```

## 📞 Support

- Check the [Setup Guide](Setup.md) for common issues
- Review [API Documentation](API.md) for endpoint details
- Test with provided curl examples
- Check application logs for errors

## 🔄 Version History

- **v1.0.0**: Initial release with user authentication
- Admin authentication system
- OTP email verification
- JWT token management
- Basic course model (ready for content features)

---

**Last Updated**: March 9, 2026
**Version**: 1.0.0</content>
<parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/index.md
