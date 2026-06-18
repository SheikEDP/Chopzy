const { DeliverySlot } = require('../models');

/**
 * GET /api/delivery-slots
 * Returns all active delivery slots
 */
exports.getAll = async (req, res, next) => {
  try {
    const slots = await DeliverySlot.findAll({
      where: { is_active: true },
      attributes: ['id', 'label', 'start_hour', 'start_minute', 'end_hour', 'end_minute', 'is_active'],
      order: [['start_hour', 'ASC'], ['start_minute', 'ASC']],
    });
    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/delivery-slots/:id
 * Returns a single delivery slot by ID
 */
exports.getById = async (req, res, next) => {
  try {
    const slot = await DeliverySlot.findByPk(req.params.id, {
      attributes: ['id', 'label', 'start_hour', 'start_minute', 'end_hour', 'end_minute', 'is_active'],
    });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }
    res.status(200).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/delivery-slots
 * Create a new delivery slot (Admin only)
 * Body: { label, start_hour, start_minute, end_hour, end_minute, is_active }
 */
exports.create = async (req, res, next) => {
  try {
    const { label, start_hour, start_minute, end_hour, end_minute, is_active } = req.body;
    
    // Validate
    if (!label || start_hour === undefined || end_hour === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Label, start_hour, and end_hour are required.'
      });
    }
    
    if (start_hour >= end_hour) {
      return res.status(400).json({
        success: false,
        message: 'Start hour must be less than end hour.'
      });
    }

    const slot = await DeliverySlot.create({
      label,
      start_hour,
      start_minute: start_minute || 0,
      end_hour,
      end_minute: end_minute || 0,
      is_active: is_active !== undefined ? is_active : 1,
    });

    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/delivery-slots/:id
 * Update a delivery slot (Admin only)
 */
exports.update = async (req, res, next) => {
  try {
    const slot = await DeliverySlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }

    const { label, start_hour, start_minute, end_hour, end_minute, is_active } = req.body;

    if (start_hour !== undefined && end_hour !== undefined && start_hour >= end_hour) {
      return res.status(400).json({
        success: false,
        message: 'Start hour must be less than end hour.'
      });
    }

    await slot.update({
      label: label || slot.label,
      start_hour: start_hour !== undefined ? start_hour : slot.start_hour,
      start_minute: start_minute !== undefined ? start_minute : slot.start_minute,
      end_hour: end_hour !== undefined ? end_hour : slot.end_hour,
      end_minute: end_minute !== undefined ? end_minute : slot.end_minute,
      is_active: is_active !== undefined ? is_active : slot.is_active,
    });

    res.status(200).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/delivery-slots/:id
 * Delete a delivery slot (Admin only)
 */
exports.delete = async (req, res, next) => {
  try {
    const slot = await DeliverySlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }

    await slot.destroy();
    res.status(200).json({ success: true, message: 'Delivery slot deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/delivery-slots/:id/toggle
 * Toggle slot active status (Admin only)
 */
exports.toggleActive = async (req, res, next) => {
  try {
    const slot = await DeliverySlot.findByPk(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found.' });
    }

    await slot.update({ is_active: !slot.is_active });
    res.status(200).json({
      success: true,
      data: slot,
      message: `Slot ${slot.is_active ? 'activated' : 'deactivated'} successfully.`
    });
  } catch (error) {
    next(error);
  }
};