const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AppConfig = sequelize.define('AppConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
  free_delivery_threshold: { type: DataTypes.DECIMAL(10,2), defaultValue: 300.00 },
  delivery_fee: { type: DataTypes.DECIMAL(10,2), defaultValue: 29.00 },
  cutting_charge_per_item: { type: DataTypes.DECIMAL(10,2), defaultValue: 10.00 },
  app_charge: { type: DataTypes.DECIMAL(10,2), defaultValue: 15.00 },
  gst_rate: { type: DataTypes.DECIMAL(5,2), defaultValue: 18.00 },
}, { tableName: 'app_config', timestamps: true, underscored: true });

module.exports = AppConfig;