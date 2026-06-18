// controllers/addressController.js
const { Address } = require('../models');
const { sequelize } = require('../models');

/**
 * GET /api/addresses
 */
exports.getAll = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']],
    });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/addresses
 */
exports.create = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { label, full_address, landmark, city, pincode, latitude, longitude, is_default } = req.body;

    // If this is being set as default, unset all others first
    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id }, transaction: t }
      );
    }

    const address = await Address.create(
      {
        user_id: req.user.id,
        label,
        full_address,
        landmark,
        city,
        pincode,
        latitude,
        longitude,
        is_default: is_default || false,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({ success: true, message: 'Address added.', data: address });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * PUT /api/addresses/:id
 */
exports.update = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!address) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    const { label, full_address, landmark, city, pincode, latitude, longitude, is_default } = req.body;

    if (is_default) {
      await Address.update(
        { is_default: false },
        { where: { user_id: req.user.id }, transaction: t }
      );
    }

    await address.update(
      { label, full_address, landmark, city, pincode, latitude, longitude, is_default },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({ success: true, message: 'Address updated.', data: address });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * DELETE /api/addresses/:id
 */
exports.remove = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    await address.destroy();
    res.status(200).json({ success: true, message: 'Address deleted.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/addresses/:id/default
 * Set as default address
 */
exports.setDefault = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const address = await Address.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!address) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    await Address.update(
      { is_default: false },
      { where: { user_id: req.user.id }, transaction: t }
    );

    await address.update({ is_default: true }, { transaction: t });
    await t.commit();

    res.status(200).json({ success: true, message: 'Default address updated.', data: address });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
