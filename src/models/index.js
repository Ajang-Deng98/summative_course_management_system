const User = require('./user.model');
const Module = require('./module.model');
const Cohort = require('./cohort.model');
const Class = require('./class.model');
const Mode = require('./mode.model');
const CourseOffering = require('./courseOffering.model');
const ActivityTracker = require('./activityTracker.model');
const Student = require('./student.model');

// Define relationships

// User relationships
// A manager is a user with role 'manager'
// A facilitator is a user with role 'facilitator'
// A student is a user with role 'student'

// Student relationships
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Student.belongsTo(Cohort, { foreignKey: 'cohortId', as: 'cohort' });
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Cohort.hasMany(Student, { foreignKey: 'cohortId', as: 'students' });

// CourseOffering relationships
CourseOffering.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });
CourseOffering.belongsTo(Cohort, { foreignKey: 'cohortId', as: 'cohort' });
CourseOffering.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
CourseOffering.belongsTo(Mode, { foreignKey: 'modeId', as: 'mode' });
CourseOffering.belongsTo(User, { foreignKey: 'facilitatorId', as: 'facilitator' });
CourseOffering.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Reverse relationships
Module.hasMany(CourseOffering, { foreignKey: 'moduleId', as: 'courseOfferings' });
Cohort.hasMany(CourseOffering, { foreignKey: 'cohortId', as: 'courseOfferings' });
Class.hasMany(CourseOffering, { foreignKey: 'classId', as: 'courseOfferings' });
Mode.hasMany(CourseOffering, { foreignKey: 'modeId', as: 'courseOfferings' });
User.hasMany(CourseOffering, { foreignKey: 'facilitatorId', as: 'assignedCourses' });

// ActivityTracker relationships
ActivityTracker.belongsTo(CourseOffering, { foreignKey: 'allocationId', as: 'courseOffering' });
ActivityTracker.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
CourseOffering.hasMany(ActivityTracker, { foreignKey: 'allocationId', as: 'activityLogs' });

module.exports = {
  User,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
  Student
};