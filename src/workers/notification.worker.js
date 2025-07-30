const { redisClient } = require('../config/redis');
const { User, CourseOffering, ActivityTracker, Module } = require('../models');

// Process notifications for managers
const processManagerNotifications = async () => {
  try {
    // Get notification from queue
    const notification = await redisClient.rPop('notifications:managers');
    if (!notification) {
      return;
    }

    const data = JSON.parse(notification);
    console.log('Processing manager notification:', data);

    // Get activity log details
    const activityLog = await ActivityTracker.findByPk(data.activityLogId, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            {
              model: User,
              as: 'facilitator',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    if (!activityLog) {
      console.error('Activity log not found:', data.activityLogId);
      return;
    }

    // Get all managers
    const managers = await User.findAll({
      where: {
        role: 'manager',
        active: true
      },
      attributes: ['id', 'email', 'firstName', 'lastName']
    });

    // In a real application, you would send emails or push notifications to managers
    // For this example, we'll just log the notifications
    for (const manager of managers) {
      console.log(`Notification for manager ${manager.email}:`);
      
      if (data.type === 'activity_log_submitted') {
        console.log(`Facilitator ${activityLog.courseOffering.facilitator.firstName} ${activityLog.courseOffering.facilitator.lastName} has submitted an activity log for ${activityLog.courseOffering.module.name} (Week ${activityLog.weekNumber})`);
      } else if (data.type === 'activity_log_updated') {
        console.log(`Facilitator ${activityLog.courseOffering.facilitator.firstName} ${activityLog.courseOffering.facilitator.lastName} has updated an activity log for ${activityLog.courseOffering.module.name} (Week ${activityLog.weekNumber})`);
      }
    }

    // Log notification delivery
    await redisClient.lPush('notifications:logs', JSON.stringify({
      type: data.type,
      activityLogId: data.activityLogId,
      deliveredTo: managers.map(m => m.id),
      timestamp: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error processing manager notification:', error);
  }
};

// Process reminders for facilitators
const processFacilitatorReminders = async () => {
  try {
    // Get current date
    const currentDate = new Date();
    const currentWeek = Math.ceil((currentDate - new Date(currentDate.getFullYear(), 0, 1)) / 604800000);

    // Get active course offerings
    const courseOfferings = await CourseOffering.findAll({
      where: {
        active: true
      },
      include: [
        {
          model: User,
          as: 'facilitator',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Module,
          as: 'module'
        }
      ]
    });

    // Check for missing activity logs
    for (const offering of courseOfferings) {
      // Skip if no facilitator assigned
      if (!offering.facilitator) {
        continue;
      }

      // Check if activity log exists for current week
      const activityLog = await ActivityTracker.findOne({
        where: {
          allocationId: offering.id,
          weekNumber: currentWeek
        }
      });

      // If no activity log, send reminder
      if (!activityLog) {
        console.log(`Reminder for facilitator ${offering.facilitator.email}:`);
        console.log(`Please submit your activity log for ${offering.module.name} (Week ${currentWeek})`);

        // In a real application, you would send emails or push notifications to facilitators
        // For this example, we'll just log the reminders

        // Log reminder delivery
        await redisClient.lPush('notifications:logs', JSON.stringify({
          type: 'facilitator_reminder',
          facilitatorId: offering.facilitator.id,
          allocationId: offering.id,
          weekNumber: currentWeek,
          timestamp: new Date().toISOString()
        }));
      }
    }
  } catch (error) {
    console.error('Error processing facilitator reminders:', error);
  }
};

// Start workers
const startWorkers = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected for workers');

    // Process manager notifications every 10 seconds
    setInterval(processManagerNotifications, 10000);

    // Process facilitator reminders once a day
    setInterval(processFacilitatorReminders, 86400000);

    console.log('Notification workers started');
  } catch (error) {
    console.error('Error starting notification workers:', error);
  }
};

// Start workers if this file is run directly
if (require.main === module) {
  startWorkers();
}

module.exports = {
  processManagerNotifications,
  processFacilitatorReminders,
  startWorkers
};