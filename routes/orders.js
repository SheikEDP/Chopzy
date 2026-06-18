// routes/orders.js
const express           = require('express');
const router            = express.Router();
const { body }          = require('express-validator');
const orderController   = require('../controllers/orderController');
const { protect }       = require('../middleware/auth');
const { validate }      = require('../middleware/errorHandler');

// All order routes require authentication
router.use(protect);

const placeOrderRules = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items must be a non-empty array.'),
  body('items.*.product_id')
    .notEmpty().withMessage('Each item must have a product_id.')
    .isInt({ min: 1 }).withMessage('product_id must be a positive integer.'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
  body('delivery_address')
    .notEmpty().withMessage('Delivery address is required.'),
  body('delivery_slot')
    .notEmpty().withMessage('Delivery slot is required.'),
  body('payment_method')
    .optional()
    .isIn(['razorpay', 'upi', 'card', 'netbanking', 'wallet', 'cod'])
    .withMessage('Invalid payment method.'),
];

router.post('/',              placeOrderRules, validate, orderController.placeOrder);
router.get('/',               orderController.getUserOrders);
router.get('/:id',            orderController.getOrderById);
router.patch('/:id/cancel',   orderController.cancelOrder);

module.exports = router;
