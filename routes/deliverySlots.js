const express = require('express');
const router = express.Router();
const deliverySlotController = require('../controllers/deliverySlotController');
const { adminProtect } = require('../middleware/adminAuth');

// Public routes (for customers)
router.get('/', deliverySlotController.getAll);
router.get('/:id', deliverySlotController.getById);

// Admin routes (protected)
router.post('/', adminProtect, deliverySlotController.create);
router.put('/:id', adminProtect, deliverySlotController.update);
router.delete('/:id', adminProtect, deliverySlotController.delete);
router.patch('/:id/toggle', adminProtect, deliverySlotController.toggleActive);

module.exports = router;