

// const { AppConfig } = require('../models');

// /**
//  * GET /api/admin/config
//  * Returns app configuration
//  */
// exports.get = async (req, res) => {
//   try {
//     let config = await AppConfig.findByPk(1);
//     if (!config) {
//       config = await AppConfig.create({
//         id: 1,
//         free_delivery_threshold: 300,
//         delivery_fee: 29,
//         cutting_charge_per_item: 10,
//         app_charge: 15,
//         gst_rate: 18,
//       });
//     }
//     res.json({ success: true, data: config });
//   } catch (err) {
//     console.error('Error fetching config:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * PUT /api/admin/config
//  * Updates app configuration
//  */
// exports.update = async (req, res) => {
//   try {
//     const {
//       free_delivery_threshold,
//       delivery_fee,
//       cutting_charge_per_item,
//       app_charge,
//       gst_rate,
//     } = req.body;

//     let config = await AppConfig.findByPk(1);
//     if (!config) {
//       config = await AppConfig.create({ id: 1 });
//     }

//     const updateData = {};
//     if (free_delivery_threshold !== undefined) {
//       updateData.free_delivery_threshold = parseFloat(free_delivery_threshold);
//     }
//     if (delivery_fee !== undefined) {
//       updateData.delivery_fee = parseFloat(delivery_fee);
//     }
//     if (cutting_charge_per_item !== undefined) {
//       updateData.cutting_charge_per_item = parseFloat(cutting_charge_per_item);
//     }
//     if (app_charge !== undefined) {
//       updateData.app_charge = parseFloat(app_charge);
//     }
//     if (gst_rate !== undefined) {
//       updateData.gst_rate = parseFloat(gst_rate);
//     }

//     await config.update(updateData);

//     res.json({ success: true, data: config });
//   } catch (err) {
//     console.error('Error updating config:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// controllers/adminConfigController.js
const { AppConfig } = require('../models');

/**
 * GET /api/admin/config
 * Returns app configuration (admin only)
 */
exports.get = async (req, res) => {
  try {
    let config = await AppConfig.findByPk(1);
    
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
};

/**
 * PUT /api/admin/config
 * Updates app configuration
 */
exports.update = async (req, res) => {
  try {
    const {
      free_delivery_km,
      delivery_charge_per_km,
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
    if (free_delivery_km !== undefined) {
      updateData.free_delivery_km = parseFloat(free_delivery_km);
    }
    if (delivery_charge_per_km !== undefined) {
      updateData.delivery_charge_per_km = parseFloat(delivery_charge_per_km);
    }
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