const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliverySlot = sequelize.define('DeliverySlot', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  label: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  start_hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 23,
    },
  },
  start_minute: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 59,
    },
  },
  end_hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 23,
    },
  },
  end_minute: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 59,
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'delivery_slots',
  timestamps: false, // Disable automatic createdAt/updatedAt
  underscored: true,
});

module.exports = DeliverySlot;