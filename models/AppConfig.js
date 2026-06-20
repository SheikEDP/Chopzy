

// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const AppConfig = sequelize.define('AppConfig', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     defaultValue: 1,
//   },
//   free_delivery_threshold: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 300.00,
//     allowNull: false,
//   },
//   delivery_fee: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 29.00,
//     allowNull: false,
//   },
//   cutting_charge_per_item: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 10.00,
//     allowNull: false,
//   },
//   app_charge: {
//     type: DataTypes.DECIMAL(10, 2),
//     defaultValue: 15.00,
//     allowNull: false,
//   },
//   gst_rate: {
//     type: DataTypes.DECIMAL(5, 2),
//     defaultValue: 18.00,
//     allowNull: false,
//   },
// }, {
//   tableName: 'app_config',
//   timestamps: false, // Disable automatic timestamps
//   underscored: true,
// });

// module.exports = AppConfig;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AppConfig = sequelize.define('AppConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    defaultValue: 1,
  },
  free_delivery_km: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 3.00,
    allowNull: false,
  },
  delivery_charge_per_km: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 5.00,
    allowNull: false,
  },
  free_delivery_threshold: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 300.00,
    allowNull: false,
  },
  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 29.00,
    allowNull: false,
  },
  cutting_charge_per_item: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 10.00,
    allowNull: false,
  },
  app_charge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 15.00,
    allowNull: false,
  },
  gst_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 18.00,
    allowNull: false,
  },
}, {
  tableName: 'app_config',
  timestamps: false,
  underscored: true,
});

module.exports = AppConfig;