const express = require('express');
const { CourseOffering, Module, User, Cohort, Class, Mode } = require('../models');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

// Debug endpoint to check facilitator's course offerings
router.get('/facilitator-courses', authenticate, async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    
    const courseOfferings = await CourseOffering.findAll({
      where: { facilitatorId },
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Mode, as: 'mode' }
      ]
    });

    res.json({
      facilitatorId,
      facilitatorEmail: req.user.email,
      courseOfferings: courseOfferings.map(co => ({
        id: co.id,
        module: co.module.name,
        cohort: co.cohort.name,
        class: co.class.name,
        mode: co.mode.name,
        trimester: co.trimester,
        intakePeriod: co.intakePeriod,
        active: co.active
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check all available IDs
router.get('/ids', async (req, res) => {
  try {
    const modules = await Module.findAll({ attributes: ['id', 'name', 'code'] });
    const cohorts = await Cohort.findAll({ attributes: ['id', 'name', 'year'] });
    const classes = await Class.findAll({ attributes: ['id', 'name', 'year'] });
    const modes = await Mode.findAll({ attributes: ['id', 'name'] });
    const facilitators = await User.findAll({ 
      where: { role: 'facilitator' },
      attributes: ['id', 'firstName', 'lastName', 'email'] 
    });
    const courseOfferings = await CourseOffering.findAll({
      attributes: ['id', 'moduleId', 'facilitatorId', 'trimester', 'intakePeriod', 'active']
    });

    res.json({
      modules,
      cohorts,
      classes,
      modes,
      facilitators,
      courseOfferings
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;