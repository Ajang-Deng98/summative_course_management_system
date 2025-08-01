# Course Management Platform

A comprehensive multi-feature backend system for academic institutions to support faculty operations, monitor student progress, and enhance academic coordination. Built with Node.js, Express, MySQL, and Redis.


## LINK TO VIDEO AND HOSTED GITHUB PAGE FOR STUDENT REFLECTION

- **Video**  https://youtu.be/DVYgd23KKcs
- **Hosted Github page** https://ajang-deng98.github.io/summative_course_management_system/


## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Environment Configuration](#environment-configuration)
- [Testing](#testing)

## Project Overview

This system consists of three integrated modules:

### Module 1: Course Allocation System
- **Purpose**: Manage facilitator assignments to courses for specific cohorts, trimesters, and intake periods
- **Actors**: Academic Managers (full CRUD), Facilitators (view only)
- **Features**: Course offering management, filtering, role-based access control

### Module 2: Facilitator Activity Tracker (FAT)
- **Purpose**: Track weekly activities including attendance, grading, and moderation
- **Actors**: Facilitators (submit logs), Managers (monitor compliance)
- **Features**: Weekly activity logs, Redis notifications, automated alerts

### Module 3: Student Reflection Page with i18n/l10n
- **Purpose**: Multilingual student feedback collection
- **Features**: English/French support, responsive design, GitHub Pages deployment
- **Live Demo**: [Student Reflection Page](https://ajang-deng98.github.io/summative_course_management_system/)

## Technologies Used

- **Backend**: Node.js v14+, Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens) with bcrypt password hashing
- **Queuing System**: Redis for background notifications
- **Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest with comprehensive unit tests
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Deployment**: GitHub Pages for student reflection page

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
   ```bash
   node --version  # Should be v14+
   ```

2. **MySQL** (v8.0 or higher)
   ```bash
   mysql --version
   ```

3. **Redis** (v6.0 or higher)
   ```bash
   redis-server --version
   ```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ajang-Deng98/summative_course_management_system.git
   cd summative_course_management_system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis credentials
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE course_management;
   exit
   
   # Initialize database with sample data
   npm run init-db
   ```

5. **Start Services**
   ```bash
   # Terminal 1: Start Redis
   redis-server
   
   # Terminal 2: Start the application
   npm start
   
   # Terminal 3: Start notification worker
   npm run worker
   ```

6. **Verify Installation**
   - API: http://localhost:3000/api
   - Swagger Docs: http://localhost:3000/api-docs
   - Student Reflection: http://localhost:3000/

## Database Schema

### Entity Relationship Overview

```
User (Manager/Facilitator/Student)
├── CourseOffering (facilitatorId)
├── ActivityTracker (createdBy)
└── Student (userId)

CourseOffering
├── Module (moduleId)
├── Cohort (cohortId)
├── Class (classId)
├── Mode (modeId)
├── User/Facilitator (facilitatorId)
└── ActivityTracker (allocationId)
```

### Core Models

#### User Model
```javascript
{
  id: INTEGER (Primary Key),
  firstName: STRING (Required),
  lastName: STRING (Required),
  email: STRING (Unique, Required),
  password: STRING (Hashed with bcrypt),
  role: ENUM('manager', 'facilitator', 'student'),
  active: BOOLEAN (Default: true),
  timestamps: true
}
```

#### CourseOffering Model
```javascript
{
  id: INTEGER (Primary Key),
  moduleId: INTEGER (Foreign Key → Module),
  facilitatorId: INTEGER (Foreign Key → User),
  cohortId: INTEGER (Foreign Key → Cohort),
  classId: INTEGER (Foreign Key → Class),
  modeId: INTEGER (Foreign Key → Mode),
  trimester: INTEGER (1-3),
  intakePeriod: ENUM('HT1', 'HT2', 'FT'),
  startDate: DATE,
  endDate: DATE,
  active: BOOLEAN (Default: true),
  createdBy: INTEGER (Foreign Key → User),
  timestamps: true
}
```

#### ActivityTracker Model
```javascript
{
  id: INTEGER (Primary Key),
  allocationId: INTEGER (Foreign Key → CourseOffering),
  weekNumber: INTEGER (Required),
  attendance: JSON (Array of booleans),
  formativeOneGrading: ENUM('Done', 'Pending', 'Not Started'),
  formativeTwoGrading: ENUM('Done', 'Pending', 'Not Started'),
  summativeGrading: ENUM('Done', 'Pending', 'Not Started'),
  courseModeration: ENUM('Done', 'Pending', 'Not Started'),
  intranetSync: ENUM('Done', 'Pending', 'Not Started'),
  gradeBookStatus: ENUM('Done', 'Pending', 'Not Started'),
  submissionDate: DATE (Auto-generated),
  notes: TEXT,
  createdBy: INTEGER (Foreign Key → User),
  timestamps: true
}
```

### Relationships

- **User → CourseOffering**: One-to-Many (facilitatorId)
- **CourseOffering → ActivityTracker**: One-to-Many (allocationId)
- **Module/Cohort/Class/Mode → CourseOffering**: One-to-Many
- **User → Student**: One-to-One (userId)
- **Cohort → Student**: One-to-Many (cohortId)

## Authentication Flow

### JWT Implementation

1. **User Registration/Login**
   ```
   POST /api/auth/login
   {
     "email": "manager@example.com",
     "password": "password123456789"
   }
   
   Response:
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "email": "manager@example.com",
       "role": "manager"
     }
   }
   ```

2. **Token Usage**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Role-Based Access Control**
   - **Manager**: Full CRUD access to all resources
   - **Facilitator**: Read assigned courses, manage own activity logs
   - **Student**: Access to reflection page only

### Security Features

- **Password Hashing**: bcrypt with salt rounds (10)
- **JWT Expiration**: Configurable token expiry
- **Input Validation**: express-validator for all endpoints
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **CORS**: Configured for cross-origin requests

## API Documentation

### Swagger Documentation

**Access**: http://localhost:3000/api-docs

**Features**:
- Interactive API testing
- Request/response schemas
- Authentication examples
- Error code documentation

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### Course Management (Manager Only)
- `GET /api/courses/offerings` - List all course offerings
- `POST /api/courses/offerings` - Create course offering
- `PUT /api/courses/offerings/:id` - Update course offering
- `DELETE /api/courses/offerings/:id` - Delete course offering

#### Facilitator Operations
- `GET /api/courses/facilitator` - Get assigned courses
- `POST /api/activities/logs` - Submit activity log
- `GET /api/activities/facilitator` - Get own activity logs
- `PUT /api/activities/logs/:id` - Update activity log

#### Admin Management (Manager Only)
- `GET /api/admin/modules` - List modules
- `POST /api/admin/modules` - Create module
- `GET /api/admin/cohorts` - List cohorts
- `POST /api/admin/cohorts` - Create cohort

## Usage Examples

### 1. Manager Creates Course Offering

```bash
# Login as manager
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "password123456789"
  }'

# Create course offering
curl -X POST http://localhost:3000/api/courses/offerings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "moduleId": 1,
    "facilitatorId": 2,
    "cohortId": 1,
    "classId": 1,
    "modeId": 1,
    "trimester": 1,
    "intakePeriod": "HT1",
    "startDate": "2024-01-15",
    "endDate": "2024-04-15"
  }'
```

### 2. Facilitator Submits Activity Log

```bash
# Login as facilitator
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "facilitator@example.com",
    "password": "password123"
  }'

# Submit weekly activity log
curl -X POST http://localhost:3000/api/activities/logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "allocationId": 1,
    "weekNumber": 1,
    "attendance": [true, false, true, true],
    "formativeOneGrading": "Done",
    "formativeTwoGrading": "Pending",
    "summativeGrading": "Not Started",
    "courseModeration": "Not Started",
    "intranetSync": "Done",
    "gradeBookStatus": "Pending",
    "notes": "Week 1 activities completed"
  }'
```

### 3. Filter Course Offerings

```bash
# Get courses by trimester and facilitator
curl -X GET "http://localhost:3000/api/courses/offerings?trimester=1&facilitatorId=2" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get courses by cohort and mode
curl -X GET "http://localhost:3000/api/courses/offerings?cohortId=1&modeId=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment Configuration

### Required Environment Variables

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=course_management
DB_USER=root
DB_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Leave empty if no password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# Notification Settings
NOTIFICATION_QUEUE=course_notifications
REMINDER_QUEUE=facilitator_reminders
```

### Redis Notification Queues

- **Manager Alerts**: Triggered when facilitators submit/update logs
- **Facilitator Reminders**: Sent for missing weekly submissions
- **Background Processing**: Handled by notification worker

### Sample Data

The `npm run init-db` command creates:
- 1 Manager user (manager@example.com / password123)
- 1 Facilitator user (facilitator@example.com / password123)
- Sample modules, cohorts, classes, and modes
- Initial course offerings and activity logs

## Project Structure

```
├── index.html               # Student Reflection Page (GitHub Pages)
├── index.js                 # Reflection page JavaScript
├── styles.css               # Reflection page styles
├── translations.js          # i18n translations
├── src/
│   ├── config/
│   │   ├── database.js      # Sequelize configuration
│   │   ├── redis.js         # Redis connection setup
│   │   └── seed.js          # Database seeding
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── course.controller.js   # Course management
│   │   └── activity.controller.js # Activity tracking
│   ├── middlewares/
│   │   └── auth.middleware.js     # JWT & role-based auth
│   ├── models/
│   │   ├── user.model.js          # User entity
│   │   ├── courseOffering.model.js # Course offerings
│   │   ├── activityTracker.model.js # Activity logs
│   │   ├── module.model.js        # Academic modules
│   │   ├── cohort.model.js        # Student cohorts
│   │   ├── class.model.js         # Class definitions
│   │   ├── mode.model.js          # Delivery modes
│   │   ├── student.model.js       # Student profiles
│   │   └── index.js               # Model relationships
│   ├── routes/
│   │   ├── auth.routes.js         # Authentication endpoints
│   │   ├── course.routes.js       # Course management APIs
│   │   ├── activity.routes.js     # Activity tracking APIs
│   │   ├── admin.routes.js        # Admin operations
│   │   ├── user.routes.js         # User management
│   │   └── debug.routes.js        # Development helpers
│   ├── services/
│   │   ├── course.service.js      # Course business logic
│   │   └── activity.service.js    # Activity business logic
│   ├── tests/
│   │   ├── *.model.test.js        # Model unit tests
│   │   ├── *.service.test.js      # Service unit tests
│   │   └── *.controller.test.js   # Controller unit tests
│   ├── utils/
│   │   ├── jwt.js                 # JWT utilities
│   │   └── validation.js          # Input validation
│   ├── workers/
│   │   └── notification.worker.js # Background notifications
│   └── index.js             # Application entry point
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies & scripts
├── init-db.js               # Database initialization
├── start-worker.js          # Notification worker starter
└── README.md                # This documentation
```

## Testing

### Unit Tests Coverage

- **Models**: User, CourseOffering, ActivityTracker
- **Services**: Course service, Activity service
- **Controllers**: Authentication controller
- **Utils**: JWT utilities

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- user.model.test.js
```

### Test Results
```
Test Suites: 7 passed, 7 total
Tests:       36 passed, 36 total
Snapshots:   0 total
Time:        3.992 s
```

## Deployment

### Student Reflection Page
- **GitHub Pages**: https://ajang-deng98.github.io/summative_course_management_system/
- **Features**: English/French i18n, responsive design, localStorage persistence

### Backend Deployment
- Configure environment variables for production
- Ensure MySQL and Redis are accessible
- Use PM2 or similar for process management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## Support

For issues or questions:
- Check the API documentation at `/api-docs`
- Review the usage examples above
- Examine the test files for implementation details

## License

This project is licensed under the MIT License - see the LICENSE file for details.