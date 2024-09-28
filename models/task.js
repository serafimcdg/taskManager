const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
// Gera tabela de task's
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  deadline: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;
