const { ActivityTracker } = require('../models');

// Mock Sequelize
jest.mock('../config/database', () => {
  const SequelizeMock = require('sequelize-mock');
  return new SequelizeMock();
});

describe('ActivityTracker Model', () => {
  let activityLog;

  beforeEach(() => {
    activityLog = {
      allocationId: 1,
      weekNumber: 1,
      attendance: [true, false, true],
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Pending',
      summativeGrading: 'Not Started',
      courseModeration: 'Not Started',
      intranetSync: 'Done',
      gradeBookStatus: 'Pending',
      notes: 'Test notes',
      submissionDate: new Date()
    };
  });

  test('should create an activity log with valid data', async () => {
    // Mock create method
    const mockCreate = jest.spyOn(ActivityTracker, 'create').mockResolvedValue({
      id: 1,
      ...activityLog,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create activity log
    const result = await ActivityTracker.create(activityLog);

    // Assertions
    expect(mockCreate).toHaveBeenCalledWith(activityLog);
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('allocationId', 1);
    expect(result).toHaveProperty('weekNumber', 1);
    expect(result).toHaveProperty('attendance');
    expect(result.attendance).toEqual([true, false, true]);
    expect(result).toHaveProperty('formativeOneGrading', 'Done');
    expect(result).toHaveProperty('formativeTwoGrading', 'Pending');
    expect(result).toHaveProperty('summativeGrading', 'Not Started');
    expect(result).toHaveProperty('courseModeration', 'Not Started');
    expect(result).toHaveProperty('intranetSync', 'Done');
    expect(result).toHaveProperty('gradeBookStatus', 'Pending');
    expect(result).toHaveProperty('notes', 'Test notes');
    expect(result).toHaveProperty('submissionDate');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');

    // Restore mock
    mockCreate.mockRestore();
  });

  test('should find activity logs by allocation ID and week number', async () => {
    // Mock findOne method
    const mockFindOne = jest.spyOn(ActivityTracker, 'findOne').mockResolvedValue({
      id: 1,
      ...activityLog,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Find activity log
    const result = await ActivityTracker.findOne({
      where: {
        allocationId: 1,
        weekNumber: 1
      }
    });

    // Assertions
    expect(mockFindOne).toHaveBeenCalledWith({
      where: {
        allocationId: 1,
        weekNumber: 1
      }
    });
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('allocationId', 1);
    expect(result).toHaveProperty('weekNumber', 1);

    // Restore mock
    mockFindOne.mockRestore();
  });

  test('should update an activity log', async () => {
    // Mock findByPk method
    const mockFindByPk = jest.spyOn(ActivityTracker, 'findByPk').mockResolvedValue({
      id: 1,
      ...activityLog,
      update: jest.fn().mockResolvedValue({
        id: 1,
        ...activityLog,
        formativeOneGrading: 'Done',
        formativeTwoGrading: 'Done',
        updatedAt: new Date()
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Find and update activity log
    const log = await ActivityTracker.findByPk(1);
    const result = await log.update({
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Done'
    });

    // Assertions
    expect(mockFindByPk).toHaveBeenCalledWith(1);
    expect(log.update).toHaveBeenCalledWith({
      formativeOneGrading: 'Done',
      formativeTwoGrading: 'Done'
    });
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('formativeOneGrading', 'Done');
    expect(result).toHaveProperty('formativeTwoGrading', 'Done');

    // Restore mock
    mockFindByPk.mockRestore();
  });
});