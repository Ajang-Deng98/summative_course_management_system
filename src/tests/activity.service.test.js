const activityService = require('../services/activity.service');
const { ActivityTracker, CourseOffering, Module, User } = require('../models');
const { redisClient } = require('../config/redis');

// Mock the models and Redis
jest.mock('../models', () => ({
  ActivityTracker: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  CourseOffering: {},
  Module: {},
  User: {}
}));

jest.mock('../config/redis', () => ({
  redisClient: {
    lPush: jest.fn()
  }
}));

describe('Activity Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createActivityLog', () => {
    test('should create activity log and queue notification', async () => {
      const mockData = {
        allocationId: 1,
        weekNumber: 1,
        attendance: [true, false, true],
        formativeOneGrading: 'Done'
      };

      const mockResult = { id: 1, ...mockData };
      ActivityTracker.create.mockResolvedValue(mockResult);
      redisClient.lPush.mockResolvedValue(1);

      const result = await activityService.createActivityLog(mockData);

      expect(ActivityTracker.create).toHaveBeenCalledWith(mockData);
      expect(redisClient.lPush).toHaveBeenCalledWith(
        'notifications:managers',
        expect.stringContaining('activity_log_submitted')
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllActivityLogs', () => {
    test('should get all activity logs with filters', async () => {
      const filters = { weekNumber: 1, allocationId: 1 };
      const mockResult = [
        { id: 1, weekNumber: 1, allocationId: 1 },
        { id: 2, weekNumber: 1, allocationId: 1 }
      ];

      ActivityTracker.findAll.mockResolvedValue(mockResult);

      const result = await activityService.getAllActivityLogs(filters);

      expect(ActivityTracker.findAll).toHaveBeenCalledWith({
        where: { weekNumber: 1, allocationId: 1 },
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });

    test('should get all activity logs without filters', async () => {
      const mockResult = [{ id: 1 }, { id: 2 }];
      ActivityTracker.findAll.mockResolvedValue(mockResult);

      const result = await activityService.getAllActivityLogs();

      expect(ActivityTracker.findAll).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getActivityLogById', () => {
    test('should get activity log by ID', async () => {
      const mockResult = { id: 1, allocationId: 1 };
      ActivityTracker.findByPk.mockResolvedValue(mockResult);

      const result = await activityService.getActivityLogById(1);

      expect(ActivityTracker.findByPk).toHaveBeenCalledWith(1, {
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateActivityLog', () => {
    test('should update activity log and queue notification', async () => {
      const updateData = { formativeOneGrading: 'Done' };
      const mockUpdatedLog = { id: 1, formativeOneGrading: 'Done' };

      ActivityTracker.update.mockResolvedValue([1]);
      activityService.getActivityLogById = jest.fn().mockResolvedValue(mockUpdatedLog);
      redisClient.lPush.mockResolvedValue(1);

      const result = await activityService.updateActivityLog(1, updateData);

      expect(ActivityTracker.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
      expect(redisClient.lPush).toHaveBeenCalledWith(
        'notifications:managers',
        expect.stringContaining('activity_log_updated')
      );
      expect(result).toEqual(mockUpdatedLog);
    });

    test('should return null if activity log not found', async () => {
      ActivityTracker.update.mockResolvedValue([0]);

      const result = await activityService.updateActivityLog(1, {});

      expect(result).toBeNull();
    });
  });

  describe('deleteActivityLog', () => {
    test('should delete activity log successfully', async () => {
      ActivityTracker.destroy.mockResolvedValue(1);

      const result = await activityService.deleteActivityLog(1);

      expect(ActivityTracker.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
  });

  describe('getFacilitatorActivityLogs', () => {
    test('should get facilitator activity logs with filters', async () => {
      const filters = { weekNumber: 1 };
      const mockResult = [{ id: 1, weekNumber: 1 }];
      ActivityTracker.findAll.mockResolvedValue(mockResult);

      const result = await activityService.getFacilitatorActivityLogs(1, filters);

      expect(ActivityTracker.findAll).toHaveBeenCalledWith({
        where: { weekNumber: 1 },
        include: expect.arrayContaining([
          expect.objectContaining({
            model: CourseOffering,
            where: { facilitatorId: 1 }
          })
        ])
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('queueManagerNotification', () => {
    test('should queue notification successfully', async () => {
      redisClient.lPush.mockResolvedValue(1);

      await activityService.queueManagerNotification('test_type', 1);

      expect(redisClient.lPush).toHaveBeenCalledWith(
        'notifications:managers',
        expect.stringContaining('test_type')
      );
    });

    test('should handle Redis errors gracefully', async () => {
      redisClient.lPush.mockRejectedValue(new Error('Redis error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await activityService.queueManagerNotification('test_type', 1);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error queuing manager notification:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});