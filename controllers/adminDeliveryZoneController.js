// controllers/adminDeliveryZoneController.js
const { DeliveryZone } = require('../models');

// Helper to parse float
function safeParseFloat(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

/**
 * GET /api/admin/delivery-zones
 * Get all delivery zones
 */
exports.getAll = async (req, res) => {
  try {
    const zones = await DeliveryZone.findAll({
      order: [['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json({ success: true, data: zones });
  } catch (err) {
    console.error('Error fetching delivery zones:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/delivery-zones/:id
 * Get single delivery zone
 */
exports.getById = async (req, res) => {
  try {
    const zone = await DeliveryZone.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    }
    res.json({ success: true, data: zone });
  } catch (err) {
    console.error('Error fetching delivery zone:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/delivery-zones
 * Create a new delivery zone
 */
exports.create = async (req, res) => {
  try {
    console.log('📦 Creating delivery zone...');
    console.log('Request body:', req.body);

    const { 
      name, 
      center_lat, 
      center_lng, 
      radius, 
      delivery_fee, 
      free_delivery_threshold,
      is_active 
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Zone name is required' });
    }
    if (center_lat === undefined || center_lat === null) {
      return res.status(400).json({ success: false, message: 'Center latitude is required' });
    }
    if (center_lng === undefined || center_lng === null) {
      return res.status(400).json({ success: false, message: 'Center longitude is required' });
    }

    const zone = await DeliveryZone.create({
      name,
      center_lat: safeParseFloat(center_lat),
      center_lng: safeParseFloat(center_lng),
      radius: safeParseFloat(radius || 3.0),
      delivery_fee: safeParseFloat(delivery_fee || 29.0),
      free_delivery_threshold: safeParseFloat(free_delivery_threshold || 299.0),
      is_active: is_active === true || is_active === 'true' || is_active === 1,
    });

    const zoneData = zone.toJSON();
    delete zoneData.createdAt;
    delete zoneData.updatedAt;

    console.log('✅ Delivery zone created:', zone.id);
    res.status(201).json({ success: true, data: zoneData });
  } catch (err) {
    console.error('❌ Error creating delivery zone:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/admin/delivery-zones/:id
 * Update a delivery zone
 */
exports.update = async (req, res) => {
  try {
    console.log('📦 Updating delivery zone:', req.params.id);
    console.log('Request body:', req.body);

    const zone = await DeliveryZone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    }

    const { 
      name, 
      center_lat, 
      center_lng, 
      radius, 
      delivery_fee, 
      free_delivery_threshold,
      is_active 
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (center_lat !== undefined) updateData.center_lat = safeParseFloat(center_lat);
    if (center_lng !== undefined) updateData.center_lng = safeParseFloat(center_lng);
    if (radius !== undefined) updateData.radius = safeParseFloat(radius);
    if (delivery_fee !== undefined) updateData.delivery_fee = safeParseFloat(delivery_fee);
    if (free_delivery_threshold !== undefined) {
      updateData.free_delivery_threshold = safeParseFloat(free_delivery_threshold);
    }
    if (is_active !== undefined) {
      updateData.is_active = is_active === true || is_active === 'true' || is_active === 1;
    }

    await zone.update(updateData);

    const updatedZone = await DeliveryZone.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    console.log('✅ Delivery zone updated:', req.params.id);
    res.json({ success: true, data: updatedZone });
  } catch (err) {
    console.error('❌ Error updating delivery zone:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/admin/delivery-zones/:id
 * Delete a delivery zone
 */
exports.delete = async (req, res) => {
  try {
    console.log('🗑️ Deleting delivery zone:', req.params.id);
    
    const zone = await DeliveryZone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    }

    await zone.destroy();
    console.log('✅ Delivery zone deleted:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting delivery zone:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PATCH /api/admin/delivery-zones/:id/toggle
 * Toggle delivery zone active status
 */
exports.toggleActive = async (req, res) => {
  try {
    console.log('🔄 Toggling delivery zone:', req.params.id);
    
    const zone = await DeliveryZone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Delivery zone not found' });
    }

    const newStatus = !zone.is_active;
    await zone.update({ is_active: newStatus });

    console.log(`✅ Zone ${zone.name} is now ${newStatus ? 'active' : 'inactive'}`);
    res.json({ 
      success: true, 
      data: zone,
      message: `Zone ${zone.name} is now ${newStatus ? 'active' : 'inactive'}`
    });
  } catch (err) {
    console.error('❌ Error toggling delivery zone:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};