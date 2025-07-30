const { body, validationResult } = require('express-validator');

// Common validation rules
const validateEmail = () => body('email').isEmail().withMessage('Valid email is required');
const validatePassword = () => body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters');
const validateName = (field) => body(field).notEmpty().withMessage(`${field} is required`);
const validateRole = () => body('role').optional().isIn(['manager', 'facilitator', 'student']).withMessage('Invalid role');

// Course offering validation
const validateCourseOffering = () => [
  body('moduleId').isInt().withMessage('Module ID must be an integer'),
  body('cohortId').isInt().withMessage('Cohort ID must be an integer'),
  body('classId').isInt().withMessage('Class ID must be an integer'),
  body('modeId').isInt().withMessage('Mode ID must be an integer'),
  body('facilitatorId').isInt().withMessage('Facilitator ID must be an integer'),
  body('trimester').isInt({ min: 1, max: 3 }).withMessage('Trimester must be between 1 and 3'),
  body('intakePeriod').isIn(['HT1', 'HT2', 'FT']).withMessage('Invalid intake period'),
  body('startDate').optional().isDate().withMessage('Start date must be a valid date'),
  body('endDate').optional().isDate().withMessage('End date must be a valid date')
];

// Activity log validation
const validateActivityLog = () => [
  body('allocationId').isInt().withMessage('Allocation ID must be an integer'),
  body('weekNumber').isInt({ min: 1, max: 52 }).withMessage('Week number must be between 1 and 52'),
  body('attendance').optional().isArray().withMessage('Attendance must be an array'),
  body('formativeOneGrading').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid formative one grading status'),
  body('formativeTwoGrading').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid formative two grading status'),
  body('summativeGrading').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid summative grading status'),
  body('courseModeration').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid course moderation status'),
  body('intranetSync').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid intranet sync status'),
  body('gradeBookStatus').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid grade book status'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateRole,
  validateCourseOffering,
  validateActivityLog,
  handleValidationErrors
};