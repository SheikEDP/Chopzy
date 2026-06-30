// routes/deliveryZones.js
const express = require('express');
const router = express.Router();
const { DeliveryZone } = require('../models');

/**
 * GET /api/delivery-zones
 * Get all active delivery zones (public)
 */
router.get('/', async (req, res) => {
  try {
    const zones = await DeliveryZone.findAll({
      where: { is_active: true },
      attributes: ['id', 'name', 'center_lat', 'center_lng', 'radius', 'delivery_fee', 'free_delivery_threshold'],
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: zones });
  } catch (err) {
    console.error('Error fetching delivery zones:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;