const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

// Student model extends the User model
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cohortId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

module.exports = Student;