# Database Models Documentation

## Overview

The backend uses MongoDB with Mongoose ODM for data persistence. All models include timestamps (`createdAt`, `updatedAt`) by default.

## User Model

### Schema Definition

```javascript
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);
```

### Fields

| Field        | Type    | Required | Default   | Description                            |
| ------------ | ------- | -------- | --------- | -------------------------------------- |
| name         | String  | Yes      | -         | User's full name                       |
| email        | String  | Yes      | -         | User's email address (unique, trimmed) |
| password     | String  | Yes      | -         | Hashed password using Argon2           |
| role         | String  | No       | "student" | User role ("student" or "admin")       |
| otp          | String  | No       | -         | Hashed OTP for verification            |
| otpExpires   | Date    | No       | -         | OTP expiration timestamp               |
| isVerified   | Boolean | No       | false     | Account verification status            |
| refreshToken | String  | No       | -         | JWT refresh token                      |
| createdAt    | Date    | Auto     | -         | Document creation timestamp            |
| updatedAt    | Date    | Auto     | -         | Document update timestamp              |

### Indexes

- Unique index on `email`

## Admin Model

### Schema Definition

The Admin model is identical to the User model but with a different default role.

```javascript
const adminSchema = new mongoose.Schema(
  {
    // Same fields as User model
    role: {
      type: String,
      default: "admin",
    },
    // ... other fields
  },
  { timestamps: true },
);
```

### Fields

Same as User model, but `role` defaults to "admin".

## Course Model

### Schema Definition

```javascript
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    studentsEnrolled: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
```

### Fields

| Field            | Type   | Required | Default | Validation                | Description                 |
| ---------------- | ------ | -------- | ------- | ------------------------- | --------------------------- |
| title            | String | Yes      | -       | 5-100 chars               | Course title                |
| description      | String | Yes      | -       | -                         | Course description          |
| price            | Number | Yes      | -       | Positive                  | Course price                |
| thumbnail        | String | Yes      | -       | -                         | Thumbnail image URL         |
| videoUrl         | String | Yes      | -       | -                         | Course video URL            |
| instructor       | String | Yes      | -       | -                         | Instructor name             |
| category         | String | Yes      | -       | -                         | Course category             |
| studentsEnrolled | Number | No       | 0       | -                         | Number of enrolled students |
| createdAt        | Date   | Auto     | -       | -                         | Document creation timestamp |
| updatedAt        | Date   | Auto     | -       | Document update timestamp |

### Validation Rules

- `title`: Minimum 5 characters, maximum 100 characters
- `price`: Must be a positive number
- `thumbnail`: Should be a valid URL (validated at application level)
- `instructor`: 3-50 characters (validated at application level)
- `category`: 3-50 characters (validated at application level)

## Model Methods

### User/Admin Models

No custom methods defined. Standard Mongoose methods are used.

### Course Model

No custom methods defined. Standard Mongoose methods are used.

## Usage Examples

### Creating a User

```javascript
import User from "./models/userSchema/user.model.js";

const newUser = await User.create({
  name: "John Doe",
  email: "john@example.com",
  password: hashedPassword,
  otp: hashedOtp,
  otpExpires: Date.now() + 10 * 60 * 1000,
});
```

### Finding a User by Email

```javascript
const user = await User.findOne({ email: "john@example.com" });
```

### Updating User Verification Status

```javascript
await User.findByIdAndUpdate(userId, {
  isVerified: true,
  otp: undefined,
  otpExpires: undefined,
});
```

### Creating a Course

```javascript
import Course from "./models/contentSchema/course.model.js";

const newCourse = await Course.create({
  title: "Introduction to JavaScript",
  description: "Learn the basics of JavaScript programming",
  price: 49.99,
  thumbnail: "https://example.com/js-thumbnail.jpg",
  videoUrl: "https://example.com/js-video.mp4",
  instructor: "Jane Smith",
  category: "Programming",
});
```

### Querying Courses

```javascript
// Find all courses in a category
const courses = await Course.find({ category: "Programming" });

// Find courses by instructor
const instructorCourses = await Course.find({ instructor: "Jane Smith" });

// Update student enrollment count
await Course.findByIdAndUpdate(courseId, { $inc: { studentsEnrolled: 1 } });
```

## Database Connection

The database connection is established in `src/config/db/dbConnection.js`:

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

## Environment Variables

- `MONGO_URI`: MongoDB connection string (required)

## Notes

- All models use Mongoose's built-in timestamps
- Passwords and OTPs are stored as hashed values
- Email uniqueness is enforced at the database level
- The Course model is ready for content management features but corresponding controllers/routes are not implemented</content>
  <parameter name="filePath">/home/reyan/Dev/workshop/websites/aspirex/backend/docs/Models.md
