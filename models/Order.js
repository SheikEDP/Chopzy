// models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING(30),
    primaryKey: true,
    comment: 'e.g. ORD-1718012345678',
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id',
    },
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Snapshot of address at time of order',
  },
  delivery_slot: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g. 8:00 AM – 10:00 AM',
  },
  delivery_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  delivery_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  app_charge: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  service_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  gst: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('razorpay', 'upi', 'card', 'netbanking', 'wallet', 'cod'),
    allowNull: false,
    defaultValue: 'cod',
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  razorpay_order_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  razorpay_payment_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM(
      'placed',
      'confirmed',
      'preparing',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ),
    defaultValue: 'placed',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['status'] },
    { fields: ['payment_status'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Order;
