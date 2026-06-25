// // models/Product.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Product = sequelize.define('Product', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING(150),
//     allowNull: false,
//   },
//   category_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     references: {
//       model: 'categories',
//       key: 'id',
//     },
//   },
//   // 'raw' or 'cut'
//   product_type: {
//     type: DataTypes.ENUM('raw', 'cut'),
//     allowNull: false,
//     defaultValue: 'raw',
//   },
//   price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: false,
//   },
//   original_price: {
//     type: DataTypes.DECIMAL(10, 2),
//     allowNull: true,
//     comment: 'MRP before discount',
//   },
//   unit: {
//     type: DataTypes.STRING(50),
//     allowNull: false,
//     comment: 'e.g. 500g, 1 kg, 300ml',
//   },
//   emoji: {
//     type: DataTypes.STRING(10),
//     allowNull: true,
//   },
//   image_url: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   rating: {
//     type: DataTypes.DECIMAL(3, 1),
//     defaultValue: 0.0,
//   },
//   review_count: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },
//   badge: {
//     type: DataTypes.STRING(50),
//     allowNull: true,
//     comment: 'e.g. Fresh, Organic, Best Seller',
//   },
//   in_stock: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
//   description: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   is_active: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true,
//   },
//   sort_order: {
//     type: DataTypes.INTEGER,
//     defaultValue: 0,
//   },
// }, {
//   tableName: 'products',
//   indexes: [
//     { fields: ['category_id'] },
//     { fields: ['product_type'] },
//     { fields: ['in_stock'] },
//     { fields: ['name'] },
//   ],
// });

// module.exports = Product;


// models/Product.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
  product_type: {
    type: DataTypes.ENUM('raw', 'cut'),
    allowNull: false,
    defaultValue: 'raw',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  previous_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Previous price before last update',
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'MRP before discount',
  },
  unit: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  emoji: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0.0,
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  badge: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  in_stock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
 price_history: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: [],
  get() {
    const value = this.getDataValue('price_history');
    return value || [];
  },
  set(value) {
    this.setDataValue('price_history', value || []);
  }
},
  last_price_update: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Timestamp of last price update',
  },
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['category_id'] },
    { fields: ['product_type'] },
    { fields: ['in_stock'] },
    { fields: ['name'] },
  ],
});

module.exports = Product;