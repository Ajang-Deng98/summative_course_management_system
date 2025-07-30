const express = require('express');
const { body } = require('express-validator');
const activityController = require('../controllers/activity.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/activities/logs:
 *   get:
 *     summary: Get all activity logs with filters (manager only)
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilitatorId
 *         schema:
 *           type: integer
 *         description: Filter by facilitator ID
 *       - in: query
 *         name: allocationId
 *         schema:
 *           type: integer
 *         description: Filter by allocation ID
 *       - in: query
 *         name: weekNumber
 *         schema:
 *           type: integer
 *         description: Filter by week number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/logs', authenticate, authorize('manager'), activityController.getAllActivityLogs);

/**
 * @swagger
 * /api/activities/logs/{id}:
 *   get:
 *     summary: Get activity log by ID
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity log ID
 *     responses:
 *       200:
 *         description: Activity log retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Activity log not found
 *       500:
 *         description: Server error
 */
router.get('/logs/:id', authenticate, activityController.getActivityLogById);

/**
 * @swagger
 * /api/activities/logs:
 *   post:
 *     summary: Create a new activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allocationId
 *               - weekNumber
 *             properties:
 *               allocationId:
 *                 type: integer
 *               weekNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 52
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *               formativeOneGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               formativeTwoGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               summativeGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               courseModeration:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               intranetSync:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               gradeBookStatus:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *       400:
 *         description: Invalid input or log already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course offering not found
 *       500:
 *         description: Server error
 */
router.post(
  '/logs',
  authenticate,
  authorize('facilitator'),
  [
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
  ],
  activityController.createActivityLog
);

/**
 * @swagger
 * /api/activities/logs/{id}:
 *   put:
 *     summary: Update an activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *               formativeOneGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               formativeTwoGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               summativeGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               courseModeration:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               intranetSync:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               gradeBookStatus:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity log updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Activity log not found
 *       500:
 *         description: Server error
 */
router.put(
  '/logs/:id',
  authenticate,
  authorize('facilitator'),
  [
    body('attendance').optional().isArray().withMessage('Attendance must be an array'),
    body('formativeOneGrading').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid formative one grading status'),
    body('formativeTwoGrading').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid formative two grading status'),
    body('summativeGrading').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid summative grading status'),
    body('courseModeration').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid course moderation status'),
    body('intranetSync').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid intranet sync status'),
    body('gradeBookStatus').optional().isIn(['Done', 'Pending', 'Not Started']).withMessage('Invalid grade book status'),
    body('notes').optional().isString().withMessage('Notes must be a string')
  ],
  activityController.updateActivityLog
);

/**
 * @swagger
 * /api/activities/logs/{id}:
 *   delete:
 *     summary: Delete an activity log
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity log ID
 *     responses:
 *       200:
 *         description: Activity log deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Activity log not found
 *       500:
 *         description: Server error
 */
router.delete('/logs/:id', authenticate, activityController.deleteActivityLog);

/**
 * @swagger
 * /api/activities/facilitator:
 *   get:
 *     summary: Get facilitator's activity logs
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: weekNumber
 *         schema:
 *           type: integer
 *         description: Filter by week number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Facilitator's activity logs retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/facilitator', authenticate, authorize('facilitator'), activityController.getFacilitatorActivityLogs);

module.exports = router;