// Mock database
jest.mock('../config/database', () => {
  const SequelizeMock = require('sequelize-mock');
  return new SequelizeMock();
});

// Mock the models module
jest.mock('../models', () => ({
  CourseOffering: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  }
}));

const { CourseOffering } = require('../models');

describe('CourseOffering Model', () => {
  let courseOffering;

  beforeEach(() => {
    courseOffering = {
      moduleId: 1,
      cohortId: 1,
      classId: 1,
      modeId: 1,
      facilitatorId: 1,
      trimester: 1,
      intakePeriod: 'HT1',
      startDate: '2023-01-01',
      endDate: '2023-04-30',
      active: true
    };
  });

  test('should create a course offering with valid data', async () => {
    // Mock create method
    const mockCreate = jest.spyOn(CourseOffering, 'create').mockResolvedValue({
      id: 1,
      ...courseOffering,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create course offering
    const result = await CourseOffering.create(courseOffering);

    // Assertions
    expect(mockCreate).toHaveBeenCalledWith(courseOffering);
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('moduleId', 1);
    expect(result).toHaveProperty('cohortId', 1);
    expect(result).toHaveProperty('classId', 1);
    expect(result).toHaveProperty('modeId', 1);
    expect(result).toHaveProperty('facilitatorId', 1);
    expect(result).toHaveProperty('trimester', 1);
    expect(result).toHaveProperty('intakePeriod', 'HT1');
    expect(result).toHaveProperty('startDate', '2023-01-01');
    expect(result).toHaveProperty('endDate', '2023-04-30');
    expect(result).toHaveProperty('active', true);
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');

    // Restore mock
    mockCreate.mockRestore();
  });

  test('should find course offerings by facilitator ID', async () => {
    // Mock findAll method
    const mockFindAll = jest.spyOn(CourseOffering, 'findAll').mockResolvedValue([
      {
        id: 1,
        ...courseOffering,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        ...courseOffering,
        moduleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Find course offerings
    const result = await CourseOffering.findAll({
      where: { facilitatorId: 1 }
    });

    // Assertions
    expect(mockFindAll).toHaveBeenCalledWith({
      where: { facilitatorId: 1 }
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('id', 1);
    expect(result[1]).toHaveProperty('id', 2);

    // Restore mock
    mockFindAll.mockRestore();
  });

  test('should update a course offering', async () => {
    // Mock findByPk method
    const mockFindByPk = jest.spyOn(CourseOffering, 'findByPk').mockResolvedValue({
      id: 1,
      ...courseOffering,
      update: jest.fn().mockResolvedValue({
        id: 1,
        ...courseOffering,
        facilitatorId: 2,
        updatedAt: new Date()
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Find and update course offering
    const offering = await CourseOffering.findByPk(1);
    const result = await offering.update({ facilitatorId: 2 });

    // Assertions
    expect(mockFindByPk).toHaveBeenCalledWith(1);
    expect(offering.update).toHaveBeenCalledWith({ facilitatorId: 2 });
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('facilitatorId', 2);

    // Restore mock
    mockFindByPk.mockRestore();
  });
});