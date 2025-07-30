const { activityService } = require('../services');
const { validationResult } = require('express-validator');

// Get all activity logs with filters
exports.getAllActivityLogs = async (req, res) => {
  try {
    const filters = req.query;
    const activityLogs = await activityService.getAllActivityLogs(filters);
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error getting activity logs:', error);
    res.status(500).json({ message: 'Failed to get activity logs' });
  }
};

// Get activity log by ID
exports.getActivityLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const activityLog = await activityService.getActivityLogById(id);

    if (!activityLog) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    // Check authorization for facilitators
    if (req.user.role === 'facilitator' && activityLog.courseOffering.facilitatorId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(activityLog);
  } catch (error) {
    console.error('Error getting activity log:', error);
    res.status(500).json({ message: 'Failed to get activity log' });
  }
};

// Create a new activity log
exports.createActivityLog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Creating activity log with data:', req.body);
    console.log('User info:', req.user);

    const facilitatorId = req.user.role === 'facilitator' ? req.user.id : null;
    const activityLog = await activityService.createActivityLog(req.body, facilitatorId, req.user.id);
    res.status(201).json(activityLog);
  } catch (error) {
    console.error('Error creating activity log:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific error types
    if (error.message.includes('Access denied')) {
      return res.status(403).json({ message: error.message });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Invalid allocation ID - course offering not found',
        error: 'The specified allocationId does not exist'
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create activity log',
      error: error.message,
      details: error.original ? error.original.message : 'No additional details'
    });
  }
};

// Update an activity log
exports.updateActivityLog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const facilitatorId = req.user.role === 'facilitator' ? req.user.id : null;
    const updatedLog = await activityService.updateActivityLog(id, req.body, facilitatorId);
    
    if (!updatedLog) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.status(200).json(updatedLog);
  } catch (error) {
    console.error('Error updating activity log:', error);
    res.status(500).json({ message: 'Failed to update activity log' });
  }
};

// Delete an activity log
exports.deleteActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await activityService.deleteActivityLog(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.status(200).json({ message: 'Activity log deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity log:', error);
    res.status(500).json({ message: 'Failed to delete activity log' });
  }
};

// Get facilitator's activity logs
exports.getFacilitatorActivityLogs = async (req, res) => {
  try {
    const facilitatorId = req.user.id;
    const filters = req.query;
    const activityLogs = await activityService.getFacilitatorActivityLogs(facilitatorId, filters);
    res.status(200).json(activityLogs);
  } catch (error) {
    console.error('Error getting facilitator activity logs:', error);
    res.status(500).json({ message: 'Failed to get facilitator activity logs' });
  }
};