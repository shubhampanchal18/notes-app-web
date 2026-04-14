const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tags: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#4f7cff'
  },
  pinned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Note;
