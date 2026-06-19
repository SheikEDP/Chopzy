// const { AppConfig } = require('../models');

// exports.get = async (req, res) => {
//   let config = await AppConfig.findByPk(1);
//   if (!config) config = await AppConfig.create({ id: 1 });
//   res.json({ success: true, data: config });
// };

// exports.update = async (req, res) => {
//   const config = await AppConfig.findByPk(1);
//   await config.update(req.body);
//   res.json({ success: true, data: config });
// };

const { AppConfig } = require('../models');

/**
 * GET /api/admin/config
 * Returns app configuration
 */
exports.get = async (req, res) => {
  try {
    let config = await AppConfig.findByPk(1);
    if (!config) {
      config = await AppConfig.create({
        id: 1,
        free_delivery_threshold: 300,
        delivery_fee: 29,
        cutting_charge_per_item: 10,
        app_charge: 15,
        gst_rate: 18,
      });
    }
    res.json({ success: true, data: config });
  } catch (err) {
    console.error('Error fetching config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/admin/config
 * Updates app configuration
 */
exports.update = async (req, res) => {
  try {
    const {
      free_delivery_threshold,
      delivery_fee,
      cutting_charge_per_item,
      app_charge,
      gst_rate,
    } = req.body;

    let config = await AppConfig.findByPk(1);
    if (!config) {
      config = await AppConfig.create({ id: 1 });
    }

    const updateData = {};
    if (free_delivery_threshold !== undefined) {
      updateData.free_delivery_threshold = parseFloat(free_delivery_threshold);
    }
    if (delivery_fee !== undefined) {
      updateData.delivery_fee = parseFloat(delivery_fee);
    }
    if (cutting_charge_per_item !== undefined) {
      updateData.cutting_charge_per_item = parseFloat(cutting_charge_per_item);
    }
    if (app_charge !== undefined) {
      updateData.app_charge = parseFloat(app_charge);
    }
    if (gst_rate !== undefined) {
      updateData.gst_rate = parseFloat(gst_rate);
    }

    await config.update(updateData);

    res.json({ success: true, data: config });
  } catch (err) {
    console.error('Error updating config:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};