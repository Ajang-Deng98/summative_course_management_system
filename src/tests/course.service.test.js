const courseService = require('../services/course.service');
const { CourseOffering, Module, Cohort, Class, Mode, User } = require('../models');

// Mock the models
jest.mock('../models', () => ({
  CourseOffering: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Module: {},
  Cohort: {},
  Class: {},
  Mode: {},
  User: {}
}));

describe('Course Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourseOffering', () => {
    test('should create a course offering successfully', async () => {
      const mockData = {
        moduleId: 1,
        cohortId: 1,
        classId: 1,
        modeId: 1,
        facilitatorId: 1,
        trimester: 1,
        intakePeriod: 'HT1'
      };

      const mockResult = { id: 1, ...mockData };
      CourseOffering.create.mockResolvedValue(mockResult);

      const result = await courseService.createCourseOffering(mockData);

      expect(CourseOffering.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllCourseOfferings', () => {
    test('should get all course offerings with filters', async () => {
      const filters = { trimester: 1, cohortId: 1 };
      const mockResult = [
        { id: 1, trimester: 1, cohortId: 1 },
        { id: 2, trimester: 1, cohortId: 1 }
      ];

      CourseOffering.findAll.mockResolvedValue(mockResult);

      const result = await courseService.getAllCourseOfferings(filters);

      expect(CourseOffering.findAll).toHaveBeenCalledWith({
        where: { trimester: 1, cohortId: 1 },
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });

    test('should get all course offerings without filters', async () => {
      const mockResult = [{ id: 1 }, { id: 2 }];
      CourseOffering.findAll.mockResolvedValue(mockResult);

      const result = await courseService.getAllCourseOfferings();

      expect(CourseOffering.findAll).toHaveBeenCalledWith({
        where: {},
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('getCourseOfferingById', () => {
    test('should get course offering by ID', async () => {
      const mockResult = { id: 1, moduleId: 1 };
      CourseOffering.findByPk.mockResolvedValue(mockResult);

      const result = await courseService.getCourseOfferingById(1);

      expect(CourseOffering.findByPk).toHaveBeenCalledWith(1, {
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateCourseOffering', () => {
    test('should update course offering successfully', async () => {
      const updateData = { facilitatorId: 2 };
      const mockUpdatedOffering = { id: 1, facilitatorId: 2 };

      CourseOffering.update.mockResolvedValue([1]);
      courseService.getCourseOfferingById = jest.fn().mockResolvedValue(mockUpdatedOffering);

      const result = await courseService.updateCourseOffering(1, updateData);

      expect(CourseOffering.update).toHaveBeenCalledWith(updateData, { where: { id: 1 } });
      expect(result).toEqual(mockUpdatedOffering);
    });

    test('should return null if course offering not found', async () => {
      CourseOffering.update.mockResolvedValue([0]);

      const result = await courseService.updateCourseOffering(1, {});

      expect(result).toBeNull();
    });
  });

  describe('deleteCourseOffering', () => {
    test('should delete course offering successfully', async () => {
      CourseOffering.destroy.mockResolvedValue(1);

      const result = await courseService.deleteCourseOffering(1);

      expect(CourseOffering.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(1);
    });
  });

  describe('getFacilitatorCourses', () => {
    test('should get facilitator courses', async () => {
      const mockResult = [{ id: 1, facilitatorId: 1 }];
      CourseOffering.findAll.mockResolvedValue(mockResult);

      const result = await courseService.getFacilitatorCourses(1);

      expect(CourseOffering.findAll).toHaveBeenCalledWith({
        where: { facilitatorId: 1 },
        include: expect.any(Array)
      });
      expect(result).toEqual(mockResult);
    });
  });
});