const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { Module, Cohort, Class, Mode, User } = require('../models');
const { validationResult } = require('express-validator');

const router = express.Router();

// Module management endpoints
/**
 * @swagger
 * /api/admin/modules:
 *   get:
 *     summary: Get all modules
 *     tags: [Admin - Modules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/modules', authenticate, authorize('manager'), async (req, res) => {
  try {
    const modules = await Module.findAll({ where: { active: true } });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get modules' });
  }
});

/**
 * @swagger
 * /api/admin/modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Admin - Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               credits:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/modules', authenticate, authorize('manager'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('code').notEmpty().withMessage('Code is required'),
  body('credits').optional().isInt({ min: 1 }).withMessage('Credits must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create module' });
  }
});

// Cohort management endpoints
/**
 * @swagger
 * /api/admin/cohorts:
 *   get:
 *     summary: Get all cohorts
 *     tags: [Admin - Cohorts]
 *     security:
 *       - bearerAuth: []
 */
router.get('/cohorts', authenticate, authorize('manager'), async (req, res) => {
  try {
    const cohorts = await Cohort.findAll({ where: { active: true } });
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get cohorts' });
  }
});

/**
 * @swagger
 * /api/admin/cohorts:
 *   post:
 *     summary: Create a new cohort
 *     tags: [Admin - Cohorts]
 *     security:
 *       - bearerAuth: []
 */
router.post('/cohorts', authenticate, authorize('manager'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('year').isInt().withMessage('Year must be an integer'),
  body('program').notEmpty().withMessage('Program is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const cohort = await Cohort.create(req.body);
    res.status(201).json(cohort);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create cohort' });
  }
});

// Class management endpoints
/**
 * @swagger
 * /api/admin/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Admin - Classes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/classes', authenticate, authorize('manager'), async (req, res) => {
  try {
    const classes = await Class.findAll({ where: { active: true } });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get classes' });
  }
});

/**
 * @swagger
 * /api/admin/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Admin - Classes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/classes', authenticate, authorize('manager'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('year').isInt().withMessage('Year must be an integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const classItem = await Class.create(req.body);
    res.status(201).json(classItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create class' });
  }
});

// Mode management endpoints
/**
 * @swagger
 * /api/admin/modes:
 *   get:
 *     summary: Get all modes
 *     tags: [Admin - Modes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/modes', authenticate, authorize('manager'), async (req, res) => {
  try {
    const modes = await Mode.findAll({ where: { active: true } });
    res.json(modes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get modes' });
  }
});

/**
 * @swagger
 * /api/admin/modes:
 *   post:
 *     summary: Create a new mode
 *     tags: [Admin - Modes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/modes', authenticate, authorize('manager'), async (req, res) => {
  try {
    const mode = await Mode.create(req.body);
    res.status(201).json(mode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create mode' });
  }
});

// User management endpoints
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', authenticate, authorize('manager'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'active'],
      where: { active: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users' });
  }
});

/**
 * @swagger
 * /api/admin/facilitators:
 *   get:
 *     summary: Get all facilitators
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/facilitators', authenticate, authorize('manager'), async (req, res) => {
  try {
    const facilitators = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      where: { role: 'facilitator', active: true }
    });
    res.json(facilitators);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get facilitators' });
  }
});

module.exports = router;