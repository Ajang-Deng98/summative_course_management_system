const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/courses/offerings:
 *   get:
 *     summary: Get all course offerings with filters
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trimester
 *         schema:
 *           type: string
 *         description: Filter by trimester
 *       - in: query
 *         name: cohortId
 *         schema:
 *           type: integer
 *         description: Filter by cohort ID
 *       - in: query
 *         name: intake
 *         schema:
 *           type: string
 *           enum: [HT1, HT2, FT]
 *         description: Filter by intake period
 *       - in: query
 *         name: facilitatorId
 *         schema:
 *           type: integer
 *         description: Filter by facilitator ID
 *       - in: query
 *         name: modeId
 *         schema:
 *           type: integer
 *         description: Filter by mode ID
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Course offerings retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/offerings', authenticate, authorize('manager'), courseController.getAllCourseOfferings);

/**
 * @swagger
 * /api/courses/offerings/{id}:
 *   get:
 *     summary: Get course offering by ID
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Course offering retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course offering not found
 *       500:
 *         description: Server error
 */
router.get('/offerings/:id', authenticate, courseController.getCourseOfferingById);

/**
 * @swagger
 * /api/courses/offerings:
 *   post:
 *     summary: Create a new course offering
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - cohortId
 *               - classId
 *               - modeId
 *               - facilitatorId
 *               - trimester
 *               - intake
 *             properties:
 *               moduleId:
 *                 type: integer
 *               cohortId:
 *                 type: integer
 *               classId:
 *                 type: integer
 *               modeId:
 *                 type: integer
 *               facilitatorId:
 *                 type: integer
 *               trimester:
 *                 type: string
 *               intake:
 *                 type: string
 *                 enum: [HT1, HT2, FT]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Course offering created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Related entity not found
 *       500:
 *         description: Server error
 */
router.post(
  '/offerings',
  authenticate,
  authorize('manager'),
  [
    body('moduleId').isInt().withMessage('Module ID must be an integer'),
    body('cohortId').isInt().withMessage('Cohort ID must be an integer'),
    body('classId').isInt().withMessage('Class ID must be an integer'),
    body('modeId').isInt().withMessage('Mode ID must be an integer'),
    body('facilitatorId').isInt().withMessage('Facilitator ID must be an integer'),
    body('trimester').isInt({ min: 1, max: 3 }).withMessage('Trimester must be between 1 and 3'),
    body('intakePeriod').isIn(['HT1', 'HT2', 'FT']).withMessage('Invalid intake period'),
    body('startDate').optional().isDate().withMessage('Start date must be a valid date'),
    body('endDate').optional().isDate().withMessage('End date must be a valid date')
  ],
  courseController.createCourseOffering
);

/**
 * @swagger
 * /api/courses/offerings/{id}:
 *   put:
 *     summary: Update a course offering
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleId:
 *                 type: integer
 *               cohortId:
 *                 type: integer
 *               classId:
 *                 type: integer
 *               modeId:
 *                 type: integer
 *               facilitatorId:
 *                 type: integer
 *               trimester:
 *                 type: string
 *               intake:
 *                 type: string
 *                 enum: [HT1, HT2, FT]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course offering updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course offering or related entity not found
 *       500:
 *         description: Server error
 */
router.put(
  '/offerings/:id',
  authenticate,
  authorize('manager'),
  [
    body('moduleId').optional().isInt().withMessage('Module ID must be an integer'),
    body('cohortId').optional().isInt().withMessage('Cohort ID must be an integer'),
    body('classId').optional().isInt().withMessage('Class ID must be an integer'),
    body('modeId').optional().isInt().withMessage('Mode ID must be an integer'),
    body('facilitatorId').optional().isInt().withMessage('Facilitator ID must be an integer'),
    body('trimester').optional().isInt({ min: 1, max: 3 }).withMessage('Trimester must be between 1 and 3'),
    body('intakePeriod').optional().isIn(['HT1', 'HT2', 'FT']).withMessage('Invalid intake period'),
    body('startDate').optional().isDate().withMessage('Start date must be a valid date'),
    body('endDate').optional().isDate().withMessage('End date must be a valid date'),
    body('active').optional().isBoolean().withMessage('Active must be a boolean')
  ],
  courseController.updateCourseOffering
);

/**
 * @swagger
 * /api/courses/offerings/{id}:
 *   delete:
 *     summary: Delete a course offering
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Course offering deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course offering not found
 *       500:
 *         description: Server error
 */
router.delete('/offerings/:id', authenticate, authorize('manager'), courseController.deleteCourseOffering);

/**
 * @swagger
 * /api/courses/facilitator:
 *   get:
 *     summary: Get facilitator's assigned courses
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facilitator's courses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/facilitator', authenticate, authorize('facilitator'), courseController.getFacilitatorCourses);

module.exports = router;