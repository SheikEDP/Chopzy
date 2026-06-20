// const { DeliverySlot } = require('../models');

// /**
//  * GET /api/admin/delivery-slots
//  * Returns all delivery slots
//  */
// exports.getAll = async (req, res) => {
//   try {
//     const slots = await DeliverySlot.findAll({
//       order: [['start_hour', 'ASC'], ['start_minute', 'ASC']],
//     });
//     res.json({ success: true, data: slots });
//   } catch (err) {
//     console.error('Error fetching delivery slots:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * POST /api/admin/delivery-slots
//  * Creates a new delivery slot
//  */
// exports.create = async (req, res) => {
//   try {
//     const { label, start_hour, start_minute, end_hour, end_minute, is_active } = req.body;
    
//     // Validate
//     if (!label || start_hour === undefined || end_hour === undefined) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Label, start_hour, and end_hour are required.' 
//       });
//     }
    
//     const startHour = parseInt(start_hour);
//     const endHour = parseInt(end_hour);
    
//     if (startHour >= endHour) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Start hour must be less than end hour.' 
//       });
//     }

//     const slot = await DeliverySlot.create({
//       label,
//       start_hour: startHour,
//       start_minute: start_minute ? parseInt(start_minute) : 0,
//       end_hour: endHour,
//       end_minute: end_minute ? parseInt(end_minute) : 0,
//       is_active: is_active !== undefined ? is_active : 1,
//     });

//     res.status(201).json({ success: true, data: slot });
//   } catch (err) {
//     console.error('Error creating delivery slot:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * PUT /api/admin/delivery-slots/:id
//  * Updates a delivery slot
//  */
// exports.update = async (req, res) => {
//   try {
//     const slot = await DeliverySlot.findByPk(req.params.id);
//     if (!slot) {
//       return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
//     }

//     const { label, start_hour, start_minute, end_hour, end_minute, is_active } = req.body;

//     // Build update data
//     const updateData = {};
//     if (label !== undefined) updateData.label = label;
//     if (start_hour !== undefined) {
//       const startHour = parseInt(start_hour);
//       if (end_hour !== undefined && startHour >= parseInt(end_hour)) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Start hour must be less than end hour.' 
//         });
//       }
//       updateData.start_hour = startHour;
//     }
//     if (start_minute !== undefined) updateData.start_minute = parseInt(start_minute);
//     if (end_hour !== undefined) {
//       const endHour = parseInt(end_hour);
//       if (start_hour !== undefined && parseInt(start_hour) >= endHour) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Start hour must be less than end hour.' 
//         });
//       }
//       updateData.end_hour = endHour;
//     }
//     if (end_minute !== undefined) updateData.end_minute = parseInt(end_minute);
//     if (is_active !== undefined) updateData.is_active = is_active;

//     await slot.update(updateData);

//     res.json({ success: true, data: slot });
//   } catch (err) {
//     console.error('Error updating delivery slot:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * PATCH /api/admin/delivery-slots/:id/toggle
//  * Toggle slot active status
//  */
// exports.toggleActive = async (req, res) => {
//   try {
//     const slot = await DeliverySlot.findByPk(req.params.id);
//     if (!slot) {
//       return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
//     }

//     await slot.update({ is_active: !slot.is_active });
    
//     res.json({ 
//       success: true, 
//       data: slot,
//       message: `Slot ${slot.is_active ? 'activated' : 'deactivated'} successfully.` 
//     });
//   } catch (err) {
//     console.error('Error toggling delivery slot:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * DELETE /api/admin/delivery-slots/:id
//  * Deletes a delivery slot
//  */
// exports.delete = async (req, res) => {
//   try {
//     const slot = await DeliverySlot.findByPk(req.params.id);
//     if (!slot) {
//       return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
//     }

//     await slot.destroy();
//     res.json({ success: true });
//   } catch (err) {
//     console.error('Error deleting delivery slot:', err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

const { DeliverySlot } = require('../models');

/**
 * GET /api/admin/delivery-slots
 * Returns all delivery slots
 */
exports.getAll = async (req, res) => {
  try {
    const slots = await DeliverySlot.findAll({
      order: [['start_hour', 'ASC'], ['start_minute', 'ASC']],
    });
    res.json({ success: true, data: slots });
  } catch (err) {
    console.error('Error fetching delivery slots:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/delivery-slots
 * Creates a new delivery slot
 */
exports.create = async (req, res) => {
  try {
    const { label, start_hour, start_minute, end_hour, end_minute } = req.body;
    
    console.log('📦 Creating delivery slot:', { label, start_hour, start_minute, end_hour, end_minute });
    
    // Validate
    if (!label || start_hour === undefined || end_hour === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Label, start_hour, and end_hour are required.' 
      });
    }
    
    const startHour = parseInt(start_hour);
    const endHour = parseInt(end_hour);
    
    if (startHour >= endHour) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start hour must be less than end hour.' 
      });
    }

    const slot = await DeliverySlot.create({
      label,
      start_hour: startHour,
      start_minute: start_minute ? parseInt(start_minute) : 0,
      end_hour: endHour,
      end_minute: end_minute ? parseInt(end_minute) : 0,
      is_active: 1,
    });

    console.log('✅ Delivery slot created:', slot.id);
    res.status(201).json({ success: true, data: slot });
  } catch (err) {
    console.error('❌ Error creating delivery slot:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/admin/delivery-slots/:id
 * Updates a delivery slot
 */
exports.update = async (req, res) => {
  try {
    const slot = await DeliverySlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }

    const { label, start_hour, start_minute, end_hour, end_minute } = req.body;
    
    console.log('📦 Updating delivery slot:', req.params.id, { label, start_hour, start_minute, end_hour, end_minute });

    if (start_hour !== undefined && end_hour !== undefined) {
      const startHour = parseInt(start_hour);
      const endHour = parseInt(end_hour);
      if (startHour >= endHour) {
        return res.status(400).json({ 
          success: false, 
          message: 'Start hour must be less than end hour.' 
        });
      }
    }

    const updateData = {};
    if (label !== undefined) updateData.label = label;
    if (start_hour !== undefined) updateData.start_hour = parseInt(start_hour);
    if (start_minute !== undefined) updateData.start_minute = parseInt(start_minute);
    if (end_hour !== undefined) updateData.end_hour = parseInt(end_hour);
    if (end_minute !== undefined) updateData.end_minute = parseInt(end_minute);

    await slot.update(updateData);

    console.log('✅ Delivery slot updated:', slot.id);
    res.json({ success: true, data: slot });
  } catch (err) {
    console.error('❌ Error updating delivery slot:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/admin/delivery-slots/:id/toggle
 * Toggle slot active status
 */
exports.toggleActive = async (req, res) => {
  try {
    console.log('🔄 Toggling delivery slot:', req.params.id);
    
    const slot = await DeliverySlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }

    const newStatus = !slot.is_active;
    await slot.update({ is_active: newStatus });
    
    console.log(`✅ Slot ${newStatus ? 'activated' : 'deactivated'}:`, slot.id);
    res.json({ 
      success: true, 
      data: slot,
      message: `Slot ${newStatus ? 'activated' : 'deactivated'} successfully.` 
    });
  } catch (err) {
    console.error('❌ Error toggling delivery slot:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/admin/delivery-slots/:id
 * Deletes a delivery slot
 */
exports.delete = async (req, res) => {
  try {
    console.log('🗑️ Deleting delivery slot:', req.params.id);
    
    const slot = await DeliverySlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }

    await slot.destroy();
    console.log('✅ Delivery slot deleted:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting delivery slot:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};