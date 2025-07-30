# ALL ENDPOINTS - MANAGERS & FACILITATORS

## 🔐 AUTHENTICATION ENDPOINTS

### Register User
**POST** `/api/auth/register`
```json
{
  "firstName": "John",
  "lastName": "Manager",
  "email": "manager@test.com",
  "password": "password123",
  "role": "manager"
}
```

### Login User
**POST** `/api/auth/login`
```json
{
  "email": "manager@test.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Manager",
    "email": "manager@test.com",
    "role": "manager"
  }
}
```

---

## 👨‍💼 MANAGER ENDPOINTS (All Require: `Authorization: Bearer {manager_token}`)

### 📚 Course Offerings Management

#### GET - Get All Course Offerings
**GET** `/api/courses/offerings`
**Query Parameters:** `?trimester=2&cohortId=1&facilitatorId=2&modeId=1&intakePeriod=HT2`
**Response:**
```json
[
  {
    "id": 1,
    "moduleId": 1,
    "cohortId": 1,
    "classId": 1,
    "modeId": 1,
    "facilitatorId": 2,
    "trimester": 2,
    "intakePeriod": "HT2",
    "startDate": "2024-05-01",
    "endDate": "2024-08-01",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "creator": {
      "id": 1,
      "firstName": "John",
      "lastName": "Manager1",
      "email": "manager1@test.com"
    },
    "module": {
      "id": 1,
      "name": "Advanced Backend Development",
      "code": "ABD101",
      "credits": 3
    },
    "cohort": {
      "id": 1,
      "name": "Software Engineering 2024",
      "year": 2024,
      "program": "Software Engineering"
    },
    "class": {
      "id": 1,
      "name": "2024S",
      "year": 2024
    },
    "mode": {
      "id": 1,
      "name": "Online",
      "description": "Fully online delivery"
    },
    "facilitator": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Facilitator",
      "email": "facilitator@example.com"
    }
  }
]
```

#### GET - Get Specific Course Offering
**GET** `/api/courses/offerings/{id}`
**Response:** Same as above but single object

#### POST - Create Course Offering
**POST** `/api/courses/offerings`
```json
{
  "moduleId": 1,
  "cohortId": 1,
  "classId": 1,
  "modeId": 1,
  "facilitatorId": 2,
  "trimester": 2,
  "intakePeriod": "HT2",
  "startDate": "2024-05-01",
  "endDate": "2024-08-01"
}
```

#### PUT - Update Course Offering
**PUT** `/api/courses/offerings/{id}`
```json
{
  "facilitatorId": 3,
  "trimester": 3,
  "intakePeriod": "FT",
  "startDate": "2024-09-01",
  "endDate": "2024-12-01",
  "active": true
}
```

#### DELETE - Delete Course Offering
**DELETE** `/api/courses/offerings/{id}`
**Response:**
```json
{
  "message": "Course offering deleted successfully"
}
```

### 📊 Activity Logs Management

#### GET - Get All Activity Logs
**GET** `/api/activities/logs`
**Query Parameters:** `?weekNumber=1&allocationId=1`
**Response:**
```json
[
  {
    "id": 1,
    "allocationId": 1,
    "weekNumber": 1,
    "attendance": [true, false, true, true],
    "formativeOneGrading": "Done",
    "formativeTwoGrading": "Pending",
    "summativeGrading": "Not Started",
    "courseModeration": "Not Started",
    "intranetSync": "Done",
    "gradeBookStatus": "Pending",
    "submissionDate": "2024-01-20T10:30:00.000Z",
    "notes": "Week 1 activities completed",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "creator": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Facilitator",
      "email": "facilitator@example.com"
    },
    "courseOffering": {
      "id": 1,
      "trimester": 2,
      "intakePeriod": "HT2",
      "module": {
        "id": 1,
        "name": "Advanced Backend Development",
        "code": "ABD101"
      },
      "facilitator": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Facilitator",
        "email": "facilitator@example.com"
      }
    }
  }
]
```

#### GET - Get Specific Activity Log
**GET** `/api/activities/logs/{id}`
**Response:** Same as above but single object

### 🛠️ Admin Management

#### GET - Get All Modules
**GET** `/api/admin/modules`
**Response:**
```json
[
  {
    "id": 1,
    "code": "ABD101",
    "name": "Advanced Backend Development",
    "description": "Advanced concepts in backend development",
    "credits": 3,
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST - Create Module
**POST** `/api/admin/modules`
```json
{
  "name": "Machine Learning Fundamentals",
  "code": "MLF401",
  "description": "Introduction to machine learning concepts",
  "credits": 4
}
```

#### GET - Get All Cohorts
**GET** `/api/admin/cohorts`
**Response:**
```json
[
  {
    "id": 1,
    "name": "Software Engineering 2024",
    "year": 2024,
    "program": "Software Engineering",
    "startDate": "2024-01-15",
    "endDate": "2024-12-15",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST - Create Cohort
**POST** `/api/admin/cohorts`
```json
{
  "name": "Data Science 2024",
  "year": 2024,
  "program": "Data Science",
  "startDate": "2024-02-01",
  "endDate": "2024-11-30"
}
```

#### GET - Get All Classes
**GET** `/api/admin/classes`
**Response:**
```json
[
  {
    "id": 1,
    "name": "2024S",
    "year": 2024,
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST - Create Class
**POST** `/api/admin/classes`
```json
{
  "name": "2025J",
  "year": 2025
}
```

#### GET - Get All Modes
**GET** `/api/admin/modes`
**Response:**
```json
[
  {
    "id": 1,
    "name": "Online",
    "description": "Fully online delivery",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### POST - Create Mode
**POST** `/api/admin/modes`
```json
{
  "name": "Blended",
  "description": "Mix of online and in-person delivery"
}
```

#### GET - Get All Users
**GET** `/api/admin/users`
**Response:**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Manager",
    "email": "manager@example.com",
    "role": "manager",
    "active": true
  }
]
```

#### GET - Get All Facilitators
**GET** `/api/admin/facilitators`
**Response:**
```json
[
  {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Facilitator",
    "email": "facilitator@example.com"
  }
]
```

---

## 👨‍🏫 FACILITATOR ENDPOINTS (All Require: `Authorization: Bearer {facilitator_token}`)

### 📚 Course Assignments

#### GET - Get My Assigned Courses
**GET** `/api/courses/facilitator`
**Response:**
```json
[
  {
    "id": 1,
    "moduleId": 1,
    "cohortId": 1,
    "classId": 1,
    "modeId": 1,
    "trimester": 1,
    "intakePeriod": "HT1",
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "module": {
      "id": 1,
      "name": "Advanced Backend Development",
      "code": "ABD101",
      "credits": 3
    },
    "cohort": {
      "id": 1,
      "name": "Software Engineering 2024",
      "year": 2024,
      "program": "Software Engineering"
    },
    "class": {
      "id": 1,
      "name": "2024S",
      "year": 2024
    },
    "mode": {
      "id": 1,
      "name": "Online",
      "description": "Fully online delivery"
    }
  }
]
```

### 📊 Activity Logs Management

#### POST - Create Activity Log
**POST** `/api/activities/logs`
```json
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

#### GET - Get My Activity Logs
**GET** `/api/activities/facilitator`
**Query Parameters:** `?weekNumber=1`
**Response:**
```json
[
  {
    "id": 1,
    "allocationId": 1,
    "weekNumber": 1,
    "attendance": [true, false, true, true],
    "formativeOneGrading": "Done",
    "formativeTwoGrading": "Pending",
    "summativeGrading": "Not Started",
    "courseModeration": "Not Started",
    "intranetSync": "Done",
    "gradeBookStatus": "Pending",
    "submissionDate": "2024-01-20T10:30:00.000Z",
    "notes": "Week 1 activities completed",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "creator": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Facilitator",
      "email": "facilitator@example.com"
    },
    "courseOffering": {
      "id": 1,
      "trimester": 1,
      "intakePeriod": "HT1",
      "module": {
        "id": 1,
        "name": "Advanced Backend Development",
        "code": "ABD101"
      }
    }
  }
]
```

#### GET - Get Specific Activity Log
**GET** `/api/activities/logs/{id}`
**Response:**
```json
{
  "id": 1,
  "allocationId": 1,
  "weekNumber": 1,
  "attendance": [true, false, true, true],
  "formativeOneGrading": "Done",
  "formativeTwoGrading": "Done",
  "summativeGrading": "Pending",
  "courseModeration": "Not Started",
  "intranetSync": "Done",
  "gradeBookStatus": "Pending",
  "submissionDate": "2024-01-20T10:30:00.000Z",
  "notes": "Updated week 1 activities - all formative assessments completed",
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-21T14:20:00.000Z",
  "creator": {
    "id": 2,
    "firstName": "Jane",
    "lastName": "Facilitator",
    "email": "facilitator@example.com"
  },
  "courseOffering": {
    "id": 1,
    "trimester": 1,
    "intakePeriod": "HT1",
    "module": {
      "id": 1,
      "name": "Advanced Backend Development",
      "code": "ABD101"
    },
    "facilitator": {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Facilitator",
      "email": "facilitator@example.com"
    }
  }
}
```

#### PUT - Update Activity Log
**PUT** `/api/activities/logs/{id}`
```json
{
  "attendance": [true, true, true, true],
  "formativeOneGrading": "Done",
  "formativeTwoGrading": "Done",
  "summativeGrading": "Pending",
  "courseModeration": "Pending",
  "intranetSync": "Done",
  "gradeBookStatus": "Done",
  "notes": "Updated week 1 activities - all formative assessments completed"
}
```

#### DELETE - Delete Activity Log
**DELETE** `/api/activities/logs/{id}`
**Response:**
```json
{
  "message": "Activity log deleted successfully"
}
```

---

## 👤 SHARED ENDPOINTS (Both Roles)

### User Profile

#### GET - Get Current User Profile
**GET** `/api/users/profile`
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "id": 1,
  "email": "manager@example.com",
  "role": "manager"
}
```

---

## 🔧 DEBUG ENDPOINTS (No Auth Required)

#### GET - Get All Available IDs
**GET** `/api/debug/ids`
**Response:**
```json
{
  "modules": [
    {
      "id": 1,
      "name": "Advanced Backend Development",
      "code": "ABD101"
    }
  ],
  "cohorts": [
    {
      "id": 1,
      "name": "Software Engineering 2024",
      "year": 2024
    }
  ],
  "classes": [
    {
      "id": 1,
      "name": "2024S",
      "year": 2024
    }
  ],
  "modes": [
    {
      "id": 1,
      "name": "Online"
    }
  ],
  "facilitators": [
    {
      "id": 2,
      "firstName": "Jane",
      "lastName": "Facilitator",
      "email": "facilitator@example.com"
    }
  ],
  "courseOfferings": [
    {
      "id": 1,
      "moduleId": 1,
      "facilitatorId": 2,
      "trimester": 1,
      "intakePeriod": "HT1",
      "active": true
    }
  ]
}
```

#### GET - Get Facilitator's Course Debug Info
**GET** `/api/debug/facilitator-courses`
**Headers:** `Authorization: Bearer {facilitator_token}`
**Response:**
```json
{
  "facilitatorId": 2,
  "facilitatorEmail": "facilitator@example.com",
  "courseOfferings": [
    {
      "id": 1,
      "module": "Advanced Backend Development",
      "cohort": "Software Engineering 2024",
      "class": "2024S",
      "mode": "Online",
      "trimester": 1,
      "intakePeriod": "HT1",
      "active": true
    }
  ]
}
```

---

## 📝 VALIDATION RULES

### Course Offering:
- `moduleId`: Required integer
- `cohortId`: Required integer  
- `classId`: Required integer
- `modeId`: Required integer
- `facilitatorId`: Required integer
- `trimester`: Required integer (1-3)
- `intakePeriod`: Required enum ("HT1", "HT2", "FT")
- `startDate`: Optional date (YYYY-MM-DD)
- `endDate`: Optional date (YYYY-MM-DD)

### Activity Log:
- `allocationId`: Required integer
- `weekNumber`: Required integer (1-52)
- `attendance`: Optional array of booleans
- Grading fields: Optional enum ("Done", "Pending", "Not Started")
- `notes`: Optional string

### Module:
- `name`: Required string
- `code`: Required string (unique)
- `description`: Optional string
- `credits`: Optional integer (default: 10)

### Cohort:
- `name`: Required string (unique)
- `year`: Required integer
- `program`: Required string
- `startDate`: Optional date
- `endDate`: Optional date

---

## ❌ ERROR RESPONSES

### 400 Bad Request
```json
{
  "errors": [
    {
      "msg": "Module ID must be an integer",
      "param": "moduleId"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Course offering not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Failed to create course offering",
  "error": "Detailed error message",
  "details": "Additional error details"
}
```

---

## 🔑 KEY FEATURES

✅ **Manager Sharing:** All managers see everything created by any manager with creator attribution  
✅ **Role-based Access:** Proper authorization for each endpoint  
✅ **Creator Tracking:** All records show who created them  
✅ **Comprehensive Filtering:** Query parameters for refined searches  
✅ **Full CRUD Operations:** Complete Create, Read, Update, Delete functionality  
✅ **Error Handling:** Detailed error responses with validation messages  
✅ **Debug Support:** Helper endpoints for troubleshooting