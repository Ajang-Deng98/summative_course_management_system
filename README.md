# summative_course_management_system
# Course Management Platform

A multi-feature backend system for a Course Management Platform used by academic institutions to support faculty operations, monitor student progress, and enhance academic coordination.

## Project Overview

This system consists of three modules:

1. **Course Allocation System**: Manage which facilitator is assigned to which module (course) for a given cohort, trimester, and intake period.
2. **Facilitator Activity Tracker (FAT)**: Track weekly activities by facilitators, including attendance marking, grading, moderation, and internal updates.
3. **Student Reflection Page with i18n/l10n**: A simple multilingual frontend experience for students to reflect on their course experience.

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Queuing System**: Redis
- **Documentation**: Swagger
- **Testing**: Jest
- **Frontend**: HTML, CSS, JavaScript with i18n/l10n support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL
- Redis

### Quick Start

1. Install dependencies:
   ```
   npm install
   ```

2. Initialize database with sample data:
   ```
   npm run init-db
   ```

3. Start the application:
   ```
   npm start
   ```

4. Start the notification worker (in a separate terminal):
   ```
   npm run worker
   ```

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md)

### API Documentation

API documentation is available at `/api-docs` when the server is running.

## Project Structure

```
├── public/                  # Static files for Student Reflection Page
├── src/
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middlewares/         # Custom middleware functions
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── tests/               # Unit tests
│   ├── utils/               # Utility functions
│   ├── workers/             # Background workers
│   └── index.js             # Application entry point
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── start-worker.js          # Script to start notification worker
└── README.md                # Project documentation
```

## Features

### Module 1: Course Allocation System

- Managers can assign modules to facilitators (CRUD operations)
- Course offerings defined by module, class, trimester, cohort, intake period, and mode
- Facilitators can view their assigned courses
- Filtering by various parameters

### Module 2: Facilitator Activity Tracker (FAT)

- Facilitators can submit and update weekly activity logs
- Logs include attendance, grading status, moderation info, etc.
- Managers can view all logs and filter by various parameters
- Redis-backed notification system for reminders and alerts

### Module 3: Student Reflection Page with i18n/l10n

- Simple webpage with multilingual support (English and French)
- Reflection questions with language switching capability
- Responsive design

## Testing

Run the tests with:

```
npm test
```

## License

This project is licensed under the MIT License.