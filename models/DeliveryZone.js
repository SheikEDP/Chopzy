// models/DeliveryZone.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryZone = sequelize.define('DeliveryZone', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  center_lat: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
  },
  center_lng: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
  },
  radius: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 3.0,
  },
  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 29.0,
  },
  free_delivery_threshold: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 299.0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'delivery_zones',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DeliveryZone;