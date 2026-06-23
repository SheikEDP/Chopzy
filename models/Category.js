// // models/Category.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Category = sequelize.define('Category', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//     unique: true,
//   },
//   emoji: {
//     type: DataTypes.STRING(10),
//     allowNull: true,
//   },
//   color: {
//     type: DataTypes.STRING(20),
//     allowNull: true,
//     comment: 'Hex color code e.g. #2E7D32',
//   },
//   image_url: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   sort_order: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },
//   is_active: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
// }, {
//   tableName: 'categories',
// });

// module.exports = Category;


// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  emoji: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Hex color code e.g. #2E7D32',
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // ── NEW FIELD ──
  type: {
    type: DataTypes.ENUM('cut', 'raw', 'none'),
    defaultValue: 'none',
    allowNull: false,
    comment: 'Category type: cut (for cut fruits/veg), raw (for raw fruits/veg), none (for other categories)',
  },
}, {
  tableName: 'categories',
});

module.exports = Category;