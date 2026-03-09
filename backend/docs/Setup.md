# Setup and Deployment Guide

## Prerequisites

Before setting up the AspireX backend, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **MongoDB**: Local installation or MongoDB Atlas account
- **Gmail Account**: For email functionality

## Local Development Setup

### 1. Clone and Navigate

```bash
cd /path/to/your/projects
git clone <repository-url>
cd aspirex/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/aspirex

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Email Configuration
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# CORS
CORS_ORIGIN=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development

# Security
PASSWORD_PEPPER=your_password_pepper_string
```

### 4. Generate Secrets

**JWT Secrets:**

```bash
# Generate random strings for JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Password Pepper:**

```bash
# Generate a random pepper
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App passwords
4. Generate an app password for "AspireX"
5. Use this password in `EMAIL_PASS`

### 6. MongoDB Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb

# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at mongodb.com
2. Create a new cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### 7. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Testing the Setup

### 1. Health Check

```bash
curl http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Expected response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "userInfo": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "student"
  }
}
```

### 2. Check Email Functionality

Check your email for the OTP verification email.

### 3. Complete Registration Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 2. Verify OTP (replace 123456 with actual OTP)
curl -X POST http://localhost:5000/api/user/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# 3. Login
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# 4. Check cookies
cat cookies.txt
```

## Production Deployment

### Environment Variables for Production

Update your `.env` file for production:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/aspirex
CORS_ORIGIN=https://yourdomain.com
PORT=5000
```

### Security Considerations for Production

1. **Use HTTPS**: Always deploy behind a reverse proxy with SSL
2. **Environment Variables**: Never commit `.env` to version control
3. **Strong Secrets**: Use cryptographically secure random strings
4. **Rate Limiting**: Adjust limits based on expected traffic
5. **Database Security**: Use MongoDB Atlas with IP whitelisting
6. **Email Security**: Use dedicated email service for production

### Deployment Options

#### Option 1: Heroku

1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy via Git or Heroku CLI

#### Option 2: DigitalOcean App Platform

1. Connect GitHub repository
2. Configure environment variables
3. Set up MongoDB database

#### Option 3: AWS/Vercel

1. Use EC2 or Lambda for backend
2. Configure security groups and IAM roles
3. Set up API Gateway

#### Option 4: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t aspirex-backend .
docker run -p 5000:5000 --env-file .env aspirex-backend
```

### Nginx Reverse Proxy (Recommended)

```nginx
# /etc/nginx/sites-available/aspirex
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Maintenance

### Logging

The application logs to console. For production, consider:

- Winston for structured logging
- Log aggregation services (Papertrail, LogDNA)
- Error tracking (Sentry)

### Health Checks

```javascript
// Add to app.js
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
```

### Database Backup

- MongoDB Atlas: Automatic backups
- Local MongoDB: Set up cron jobs for `mongodump`

### Performance Monitoring

- Response times
- Memory usage
- Database query performance
- Error rates

## Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**

```
Error: MongoDB Error: Authentication failed
```

- Check `MONGO_URI` format
- Verify credentials
- Check network connectivity

**2. Email Not Sending**

```
Error: Authentication failed
```

- Verify Gmail credentials
- Check app password
- Enable less secure app access (not recommended)

**3. JWT Token Errors**

```
Error: Invalid or expired access token
```

- Check `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- Verify token expiration times

**4. CORS Errors**

```
Access to XMLHttpRequest blocked by CORS policy
```

- Check `CORS_ORIGIN` environment variable
- Verify frontend domain

**5. Rate Limiting**

```
Too many requests
```

- Adjust rate limits in `app.js`
- Check for abusive traffic patterns

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev
```

### Database Issues

```bash
# Check MongoDB status
mongo --eval "db.stats()"

# View application logs
tail -f /var/log/mongodb/mongod.log
```

## Scaling Considerations

### Horizontal Scaling

- Use PM2 for process management
- Implement Redis for session storage
- Consider load balancer

### Database Scaling

- Implement database indexing
- Use MongoDB sharding
- Optimize queries

### Caching

- Implement Redis for frequently accessed data
- Use CDN for static assets

## Backup and Recovery

### Database Backup

```bash
# Create backup
mongodump --db aspirex --out /path/to/backup

# Restore backup
mongorestore /path/to/backup
```

### Application Backup

- Keep code in Git
- Use CI/CD pipelines
- Regular environment backups

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secrets
- [ ] Password pepper configured
- [ ] Rate limiting active
- [ ] CORS properly configured
- [ ] Helmet security headers
- [ ] Input validation with Zod
- [ ] No sensitive data in logs
- [ ] Database IP whitelisting
- [ ] Regular dependency updates
- [ ] Security headers verified

## Support

For issues or questions:

1. Check the documentation
2. Review application logs
3. Test with the provided curl commands
4. Check MongoDB and Gmail configurations</content>
   <parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/Setup.md
