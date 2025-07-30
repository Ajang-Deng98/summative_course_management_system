# Course Management Platform - Usage Guide

## Prerequisites

Before running the application, ensure you have:

- Node.js (v14 or higher)
- MySQL Server
- Redis Server

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Update the following in your `.env` file:
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` - MySQL connection details
- `JWT_SECRET` - A secure secret key for JWT tokens
- `REDIS_HOST`, `REDIS_PORT` - Redis connection details

### 3. Database Setup
Start MySQL server and create the database:
```sql
CREATE DATABASE course_management;
```

### 4. Start Redis Server
Make sure Redis is running on your system.

### 5. Start the Application
```bash
# Start the main server
npm start

# In a separate terminal, start the notification worker
node start-worker.js
```

The server will run on `http://localhost:3000`

## API Documentation

Access the Swagger API documentation at: `http://localhost:3000/api-docs`

## User Roles & Permissions

### Manager
- Create, read, update, delete course allocations
- View all activity logs from facilitators
- Receive notifications about facilitator activities

### Facilitator
- View assigned courses
- Submit and update weekly activity logs
- Receive reminders for missing submissions

### Student
- Basic user role (for future extensions)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Course Management (Manager only)
- `GET /api/courses` - Get all course offerings (with filters)
- `POST /api/courses` - Create new course offering
- `GET /api/courses/:id` - Get specific course offering
- `PUT /api/courses/:id` - Update course offering
- `DELETE /api/courses/:id` - Delete course offering

### Facilitator Courses
- `GET /api/courses/facilitator/my-courses` - Get facilitator's assigned courses

### Activity Tracking
- `GET /api/activities` - Get activity logs (Manager: all, Facilitator: own)
- `POST /api/activities` - Create activity log (Facilitator only)
- `GET /api/activities/:id` - Get specific activity log
- `PUT /api/activities/:id` - Update activity log (Facilitator: own only)
- `DELETE /api/activities/:id` - Delete activity log (Facilitator: own only)

## Sample API Usage

### 1. Register a Manager
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Manager",
    "email": "manager@example.com",
    "password": "password123",
    "role": "manager"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "password123"
  }'
```

### 3. Create Course Offering (use token from login)
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "moduleId": 1,
    "cohortId": 1,
    "classId": 1,
    "modeId": 1,
    "facilitatorId": 2,
    "trimester": "T1",
    "intake": "HT1"
  }'
```

### 4. Submit Activity Log (as facilitator)
```bash
curl -X POST http://localhost:3000/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer FACILITATOR_JWT_TOKEN" \
  -d '{
    "courseOfferingId": 1,
    "weekNumber": 1,
    "attendance": [true, true, false, true],
    "formativeOneGrading": "Done",
    "formativeTwoGrading": "Pending",
    "summativeGrading": "Not Started",
    "courseModeration": "Done",
    "intranetSync": "Done",
    "gradeBookStatus": "Pending"
  }'
```

## Student Reflection Page

The multilingual student reflection page is available at:
`http://localhost:3000/index.html`

Features:
- Language switching between English and French
- Responsive design
- Local storage for language preference
- Browser language detection

## Database Seeding

To populate the database with sample data:

```javascript
// Add this to your startup script or run separately
const { seedDatabase } = require('./src/config/seed');
seedDatabase();
```

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- User model functionality
- JWT utilities
- Activity tracker model
- Course offering model

## Notification System

The Redis-backed notification system:

1. **Manager Notifications**: Triggered when facilitators submit/update activity logs
2. **Facilitator Reminders**: Daily checks for missing activity submissions

Notifications are logged to Redis queues:
- `notifications:managers` - Manager notifications
- `notifications:logs` - Delivery logs

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Redis Connection Error**
   - Verify Redis server is running
   - Check Redis connection details in `.env`

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration settings

4. **Permission Denied**
   - Verify user role and authentication
   - Check middleware authorization

### Logs

Check console output for detailed error messages and system status.

## Development

### Project Structure
```
src/
├── config/          # Database and Redis configuration
├── controllers/     # Request handlers
├── middlewares/     # Authentication and validation
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── tests/           # Unit tests
├── utils/           # Utility functions
├── workers/         # Background workers
└── index.js         # Application entry point
```

### Adding New Features

1. Create model in `src/models/`
2. Add service in `src/services/`
3. Create controller in `src/controllers/`
4. Define routes in `src/routes/`
5. Add tests in `src/tests/`
6. Update documentation

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use environment variables for all configuration
3. Set up proper logging
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure database backups
7. Monitor Redis performance
8. Set up health checks