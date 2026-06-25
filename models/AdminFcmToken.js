// models/AdminFcmToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminFcmToken = sequelize.define('AdminFcmToken', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  admin_id: {
    type: DataTypes.INTEGER.UNSIGNED,  // Match the admin_users id type
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  device_info: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  last_used: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'admin_fcm_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = AdminFcmToken;