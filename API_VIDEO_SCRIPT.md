# Course Management Platform API - Video Script

## Introduction (30 seconds)
"Welcome to the Course Management Platform API demonstration. This system provides a complete backend solution for academic institutions with three core modules: Course Allocation, Facilitator Activity Tracking, and Student Reflection. Let's explore the key API endpoints."

## Authentication Setup (1 minute)
"First, let's authenticate. The system uses JWT tokens with role-based access control."

### Manager Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "manager@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "manager@example.com",
    "role": "manager"
  }
}
```

### Facilitator Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "facilitator@example.com",
  "password": "password123"
}
```

"Save these tokens - we'll use them in the Authorization header for all subsequent requests."

## Module 1: Course Allocation System (3 minutes)

### Manager Operations
"As a manager, you can perform full CRUD operations on course offerings."

#### Create Course Offering
```
POST /api/courses
Authorization: Bearer {manager_token}
Content-Type: application/json

{
  "moduleId": 1,
  "facilitatorId": 2,
  "cohortId": 1,
  "classId": 1,
  "modeId": 1,
  "trimester": 1,
  "intakePeriod": "HT1",
  "startDate": "2024-01-15",
  "endDate": "2024-04-15"
}
```

#### Get All Course Offerings
```
GET /api/courses
Authorization: Bearer {manager_token}
```

**Response shows complete course details with relationships:**
```json
[
  {
    "id": 1,
    "trimester": 1,
    "intakePeriod": "HT1",
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "module": {
      "name": "Advanced Backend Development",
      "code": "ABD101"
    },
    "facilitator": {
      "firstName": "Jane",
      "lastName": "Facilitator"
    },
    "cohort": {
      "name": "Software Engineering 2024"
    }
  }
]
```

### Facilitator View
"Facilitators can only view their assigned courses."

```
GET /api/courses/facilitator
Authorization: Bearer {facilitator_token}
```

## Module 2: Facilitator Activity Tracker (4 minutes)

### Creating Activity Logs
"Facilitators submit weekly activity reports tracking various academic tasks."

```
POST /api/activities/logs
Authorization: Bearer {facilitator_token}
Content-Type: application/json

{
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
}
```

### Manager Monitoring
"Managers can view all activity logs with filtering capabilities."

```
GET /api/activities/logs?weekNumber=1&facilitatorId=2
Authorization: Bearer {manager_token}
```

**Response includes creator and course details:**
```json
[
  {
    "id": 1,
    "weekNumber": 1,
    "attendance": [true, false, true, true],
    "formativeOneGrading": "Done",
    "submissionDate": "2024-01-20T10:30:00.000Z",
    "creator": {
      "firstName": "Jane",
      "lastName": "Facilitator"
    },
    "courseOffering": {
      "module": {
        "name": "Advanced Backend Development"
      }
    }
  }
]
```

### Updating Activity Logs
"Facilitators can update their submissions."

```
PUT /api/activities/logs/1
Authorization: Bearer {facilitator_token}
Content-Type: application/json

{
  "formativeTwoGrading": "Done",
  "summativeGrading": "In Progress",
  "notes": "Updated - formative assessments completed"
}
```

## Admin Management Operations (2 minutes)

### Managing Modules
"Managers can create and manage academic modules."

```
POST /api/admin/modules
Authorization: Bearer {manager_token}
Content-Type: application/json

{
  "name": "Machine Learning Fundamentals",
  "code": "MLF401",
  "description": "Introduction to machine learning concepts",
  "credits": 4
}
```

### Managing Cohorts
```
POST /api/admin/cohorts
Authorization: Bearer {manager_token}
Content-Type: application/json

{
  "name": "Data Science 2024",
  "year": 2024,
  "program": "Data Science",
  "startDate": "2024-02-01",
  "endDate": "2024-11-30"
}
```

## Redis Notification System (1 minute)
"The system includes a Redis-based notification system that automatically:"
- Alerts managers when facilitators submit activity logs
- Sends reminders for missing submissions
- Processes notifications in the background

"Start the notification worker with: `npm run worker`"

## Error Handling & Validation (30 seconds)
"The API includes comprehensive error handling:"

**Example validation error:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**Example authorization error:**
```json
{
  "error": "Access denied. Manager role required."
}
```

## Debug Endpoints (30 seconds)
"For development, use debug endpoints to get available IDs:"

```
GET /api/debug/ids
```

**Returns all available entity IDs for testing:**
```json
{
  "modules": [{"id": 1, "name": "Advanced Backend Development"}],
  "facilitators": [{"id": 2, "firstName": "Jane"}],
  "courseOfferings": [{"id": 1, "moduleId": 1, "facilitatorId": 2}]
}
```

## Module 3: Student Reflection Page (30 seconds)
"The system includes a multilingual student reflection page with:"
- English and French language support
- Responsive design
- Local storage for language preferences

"Access at: `http://localhost:3000/reflection.html`"

## API Documentation (15 seconds)
"Complete API documentation is available at `/api-docs` when the server is running, powered by Swagger."

## Conclusion (15 seconds)
"This Course Management Platform provides a complete solution for academic institutions with robust authentication, comprehensive tracking, and multilingual support. All endpoints are thoroughly tested and production-ready."

---

## Video Production Notes:
- **Total Duration**: ~12 minutes
- **Tools**: Use Postman or Thunder Client for API demonstrations
- **Screen Recording**: Show actual API calls and responses
- **Pace**: Pause between sections to allow viewers to follow along
- **Highlight**: JSON structure and response formats clearly