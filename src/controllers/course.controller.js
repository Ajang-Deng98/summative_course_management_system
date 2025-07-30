const { courseService } = require('../services');
const { validationResult } = require('express-validator');

// Get all course offerings with filters
exports.getAllCourseOfferings = async (req, res) => {
  try {
    const filters = req.query;
    const courseOfferings = await courseService.getAllCourseOfferings(filters);
    res.status(200).json(courseOfferings);
  } catch (error) {
    console.error('Error getting course offerings:', error);
    res.status(500).json({ message: 'Failed to get course offerings' });
  }
};

// Get course offering by ID
exports.getCourseOfferingById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseOffering = await courseService.getCourseOfferingById(id);
    
    if (!courseOffering) {
      return res.status(404).json({ message: 'Course offering not found' });
    }

    res.status(200).json(courseOffering);
  } catch (error) {
    console.error('Error getting course offering:', error);
    res.status(500).json({ message: 'Failed to get course offering' });
  }
};

// Create a new course offering
exports.createCourseOffering = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Creating course offering with data:', req.body);

    const { 
      moduleId, 
      cohortId, 
      classId, 
      modeId, 
      facilitatorId, 
      trimester, 
      intakePeriod, 
      startDate, 
      endDate 
    } = req.body;

    // Create course offering
    const courseOffering = await courseService.createCourseOffering({
      moduleId,
      cohortId,
      classId,
      modeId,
      facilitatorId,
      trimester,
      intakePeriod,
      startDate,
      endDate
    }, req.user.id);

    res.status(201).json(courseOffering);
  } catch (error) {
    console.error('Error creating course offering:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create course offering',
      error: error.message,
      details: error.original ? error.original.message : 'No additional details'
    });
  }
};

// Update a course offering
exports.updateCourseOffering = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updatedOffering = await courseService.updateCourseOffering(id, req.body);
    
    if (!updatedOffering) {
      return res.status(404).json({ message: 'Course offering not found' });
    }

    res.status(200).json(updatedOffering);
  } catch (error) {
    console.error('Error updating course offering:', error);
    res.status(500).json({ message: 'Failed to update course offering' });
  }
};

// Delete a course offering
exports.deleteCourseOffering = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await courseService.deleteCourseOffering(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Course offering not found' });
    }

    res.status(200).json({ message: 'Course offering deleted successfully' });
  } catch (error) {
    console.error('Error deleting course offering:', error);
    res.status(500).json({ message: 'Failed to delete course offering' });
  }
};

// Get facilitator's assigned courses
exports.getFacilitatorCourses = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const courseOfferings = await courseService.getFacilitatorCourses(facilitatorId);
    res.status(200).json(courseOfferings);
  } catch (error) {
    console.error('Error getting facilitator courses:', error);
    res.status(500).json({ message: 'Failed to get facilitator courses' });
  }
};