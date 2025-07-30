const { ActivityTracker, CourseOffering, Module, User } = require('../models');
const { redisClient } = require('../config/redis');

class ActivityService {
  async createActivityLog(data, facilitatorId = null, createdBy = null) {
    // If facilitatorId is provided, validate that the allocation belongs to the facilitator
    if (facilitatorId) {
      const courseOffering = await CourseOffering.findByPk(data.allocationId);
      if (!courseOffering || courseOffering.facilitatorId !== facilitatorId) {
        throw new Error('Access denied: You can only create logs for your assigned courses');
      }
    }
    
    const logData = { ...data };
    if (createdBy) {
      logData.createdBy = createdBy;
    }
    
    const activityLog = await ActivityTracker.create(logData);
    
    // Queue notification for managers
    await this.queueManagerNotification('activity_log_submitted', activityLog.id);
    
    return activityLog;
  }

  async getAllActivityLogs(filters = {}) {
    const where = {};
    
    if (filters.weekNumber) where.weekNumber = filters.weekNumber;
    if (filters.allocationId) where.allocationId = filters.allocationId;

    return await ActivityTracker.findAll({
      where,
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] }
          ]
        },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
  }

  async getActivityLogById(id) {
    return await ActivityTracker.findByPk(id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] }
          ]
        },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
  }

  async updateActivityLog(id, data, facilitatorId = null) {
    // If facilitatorId is provided, validate that the log belongs to the facilitator
    if (facilitatorId) {
      const activityLog = await this.getActivityLogById(id);
      if (!activityLog || activityLog.courseOffering.facilitatorId !== facilitatorId) {
        throw new Error('Access denied: You can only update your own activity logs');
      }
    }
    
    const [updatedRowsCount] = await ActivityTracker.update(data, { where: { id } });
    if (updatedRowsCount === 0) return null;
    
    // Queue notification for managers
    await this.queueManagerNotification('activity_log_updated', id);
    
    return await this.getActivityLogById(id);
  }

  async deleteActivityLog(id) {
    return await ActivityTracker.destroy({ where: { id } });
  }

  async getFacilitatorActivityLogs(facilitatorId, filters = {}) {
    const where = {};
    if (filters.weekNumber) where.weekNumber = filters.weekNumber;

    return await ActivityTracker.findAll({
      where,
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          where: { facilitatorId },
          include: [
            { model: Module, as: 'module' }
          ]
        },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
  }

  async queueManagerNotification(type, activityLogId) {
    try {
      const notification = {
        type,
        activityLogId,
        timestamp: new Date().toISOString()
      };
      
      await redisClient.lPush('notifications:managers', JSON.stringify(notification));
      if (process.env.NODE_ENV !== 'test') {
        console.log('Notification queued successfully:', type, activityLogId);
      }
    } catch (error) {
      console.error('Error queuing manager notification:', error);
      // Don't throw error - notification failure shouldn't break the main operation
    }
  }
}

module.exports = new ActivityService();