// controllers/adminFcmController.js
const { sequelize } = require('../models');

/**
 * POST /api/admin/fcm-token
 * Saves (or updates) the FCM token for the logged-in admin.
 *
 * Expects body: { admin_id, token }
 * If you have JWT auth middleware for admin routes that sets
 * req.admin (or req.user), admin_id will be pulled from there first,
 * falling back to req.body.admin_id if not present.
 */
exports.saveToken = async (req, res) => {
  try {
    // Try common places an authenticated admin id might live.
    // Adjust this line to match your actual admin auth middleware, e.g.
    // req.admin?.id  or  req.user?.id
    const adminId = req.admin?.id || req.user?.id || req.body.admin_id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM token is required.' });
    }
    if (!adminId) {
      return res.status(400).json({ success: false, message: 'admin_id is required (either via auth or request body).' });
    }

    // Upsert: if this token already exists, just mark it active for this admin.
    // If it's a new token, insert it. Also deactivate the old rows for this
    // admin using a different token from the same device isn't tracked here,
    // so we simply ensure the token row exists and is active.
    const [existing] = await sequelize.query(
      'SELECT id FROM admin_fcm_tokens WHERE token = ? LIMIT 1',
      { replacements: [token] }
    );

    if (existing && existing.length > 0) {
      await sequelize.query(
        'UPDATE admin_fcm_tokens SET admin_id = ?, is_active = 1, updated_at = NOW() WHERE token = ?',
        { replacements: [adminId, token] }
      );
      console.log(`✅ Updated existing FCM token for admin ${adminId}`);
    } else {
      await sequelize.query(
        'INSERT INTO admin_fcm_tokens (admin_id, token, is_active, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())',
        { replacements: [adminId, token] }
      );
      console.log(`✅ Inserted new FCM token for admin ${adminId}`);
    }

    res.status(200).json({ success: true, message: 'FCM token saved.' });
  } catch (error) {
    console.error('❌ Error saving FCM token:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/admin/fcm-token
 * Deactivates a token (call this on admin logout so they stop
 * receiving pushes on that device).
 *
 * Expects body: { token }
 */
exports.removeToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM token is required.' });
    }

    await sequelize.query(
      'UPDATE admin_fcm_tokens SET is_active = 0 WHERE token = ?',
      { replacements: [token] }
    );

    res.status(200).json({ success: true, message: 'FCM token deactivated.' });
  } catch (error) {
    console.error('❌ Error removing FCM token:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};