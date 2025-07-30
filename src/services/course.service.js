const { CourseOffering, Module, Cohort, Class, Mode, User } = require('../models');

class CourseService {
  async createCourseOffering(data, createdBy = null) {
    const courseData = { ...data };
    if (createdBy) {
      courseData.createdBy = createdBy;
    }
    return await CourseOffering.create(courseData);
  }

  async getAllCourseOfferings(filters = {}) {
    const where = {};
    
    if (filters.trimester) where.trimester = filters.trimester;
    if (filters.cohortId) where.cohortId = filters.cohortId;
    if (filters.facilitatorId) where.facilitatorId = filters.facilitatorId;
    if (filters.modeId) where.modeId = filters.modeId;
    if (filters.intakePeriod) where.intakePeriod = filters.intakePeriod;

    return await CourseOffering.findAll({
      where,
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Mode, as: 'mode' },
        { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
  }

  async getCourseOfferingById(id) {
    return await CourseOffering.findByPk(id, {
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Mode, as: 'mode' },
        { model: User, as: 'facilitator', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });
  }

  async updateCourseOffering(id, data) {
    const [updatedRowsCount] = await CourseOffering.update(data, { where: { id } });
    if (updatedRowsCount === 0) return null;
    return await this.getCourseOfferingById(id);
  }

  async deleteCourseOffering(id) {
    return await CourseOffering.destroy({ where: { id } });
  }

  async getFacilitatorCourses(facilitatorId) {
    return await CourseOffering.findAll({
      where: { facilitatorId },
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' },
        { model: Class, as: 'class' },
        { model: Mode, as: 'mode' }
      ]
    });
  }
}

module.exports = new CourseService();