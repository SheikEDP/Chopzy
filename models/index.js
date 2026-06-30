

// // models/index.js
// const sequelize = require('../config/database');

// const User      = require('./User');
// const Otp       = require('./Otp');
// const Category  = require('./Category');
// const Product   = require('./Product');
// const Address   = require('./Address');
// const Order     = require('./Order');
// const OrderItem = require('./OrderItem');

// const AdminUser      = require('./AdminUser');
// const AdminFcmToken  = require('./AdminFcmToken');

// const DeliverySlot = require('./DeliverySlot');

// // ── Associations ──────────────────────────────────────────────────────────────

// // User ↔ Address
// User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses', onDelete: 'CASCADE' });
// Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// // User ↔ Order
// User.hasMany(Order, { foreignKey: 'user_id', as: 'orders', onDelete: 'RESTRICT' });
// Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// // Address ↔ Order
// Address.hasMany(Order, { foreignKey: 'address_id', as: 'orders', onDelete: 'SET NULL' });
// Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });

// // Category ↔ Product
// Category.hasMany(Product, { foreignKey: 'category_id', as: 'products', onDelete: 'RESTRICT' });
// Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// // Order ↔ OrderItem
// Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
// OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// // Product ↔ OrderItem
// Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_items', onDelete: 'RESTRICT' });
// OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// // AdminUser ↔ AdminFcmToken
// AdminUser.hasMany(AdminFcmToken, { foreignKey: 'admin_id', as: 'fcm_tokens' });
// AdminFcmToken.belongsTo(AdminUser, { foreignKey: 'admin_id', as: 'admin' });

// module.exports = {
//   sequelize,
//   User,
//   Otp,
//   Category,
//   Product,
//   Address,
//   Order,
//   OrderItem,
//   AdminUser,
//   AdminFcmToken,
//   DeliverySlot,
// };

const sequelize = require('../config/database');

const User = require('./User');
const Otp = require('./Otp');
const Category = require('./Category');
const Product = require('./Product');
const Address = require('./Address');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const AdminUser = require('./AdminUser');
const AdminFcmToken = require('./AdminFcmToken');
const DeliverySlot = require('./DeliverySlot');
const AppConfig = require('./AppConfig');
const DeliveryZone = require('./DeliveryZone');

// ── Associations ──────────────────────────────────────────────────────────────

// User ↔ Address
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User ↔ Order
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders', onDelete: 'RESTRICT' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Address ↔ Order
Address.hasMany(Order, { foreignKey: 'address_id', as: 'orders', onDelete: 'SET NULL' });
Order.belongsTo(Address, { foreignKey: 'address_id', as: 'address' });

// Category ↔ Product
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products', onDelete: 'RESTRICT' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'order_items', onDelete: 'RESTRICT' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// AdminUser ↔ AdminFcmToken
AdminUser.hasMany(AdminFcmToken, { foreignKey: 'admin_id', as: 'fcm_tokens' });
AdminFcmToken.belongsTo(AdminUser, { foreignKey: 'admin_id', as: 'admin' });

module.exports = {
  sequelize,
  User,
  Otp,
  Category,
  Product,
  Address,
  Order,
  OrderItem,
  AdminUser,
  AdminFcmToken,
  DeliverySlot,
  AppConfig,
  DeliveryZone,
};