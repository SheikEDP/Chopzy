const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminUser = sequelize.define('AdminUser', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  name: { type: DataTypes.STRING(100) },
  role: { type: DataTypes.ENUM('super_admin', 'manager'), defaultValue: 'manager' },
}, {
  tableName: 'admin_users',
  timestamps: false, // disable automatic createdAt/updatedAt
});

module.exports = AdminUser;