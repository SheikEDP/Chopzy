// routes/config.js
const express = require('express');
const router = express.Router();
const { AppConfig } = require('../models');

/**
 * GET /api/config
 * Public config for customer app
 */
router.get('/', async (req, res) => {
  try {
    let config = await AppConfig.findByPk(1);
    
    // If no config exists, create default
    if (!config) {
      config = await AppConfig.create({
        id: 1,
        free_delivery_km: 3.00,
        delivery_charge_per_km: 5.00,
        free_delivery_threshold: 300.00,
        delivery_fee: 0.00,
        cutting_charge_per_item: 20.00,
        app_charge: 5.00,
        gst_rate: 18.00,
      });
    }
    
    res.json({ success: true, data: config });
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;