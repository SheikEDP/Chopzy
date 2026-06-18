const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminFcmToken = sequelize.define('AdminFcmToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  admin_id: { type: DataTypes.INTEGER, allowNull: false },
  fcm_token: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'admin_fcm_tokens', timestamps: true, underscored: true });

module.exports = AdminFcmToken;