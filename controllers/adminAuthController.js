

// controllers/adminAuthController.js
const { AdminUser, AdminFcmToken } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await AdminUser.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerFcmToken = async (req, res) => {
  try {
    const { fcm_token, device_info } = req.body;
    const adminId = req.admin.id;

    if (!fcm_token) {
      return res.status(400).json({ success: false, message: 'FCM token is required' });
    }

    // Check if token already exists
    let tokenRecord = await AdminFcmToken.findOne({ where: { token: fcm_token } });

    if (tokenRecord) {
      // Update existing token
      await tokenRecord.update({
        admin_id: adminId,
        device_info: device_info || tokenRecord.device_info,
        last_used: new Date(),
        is_active: true,
      });
      console.log(`✅ Updated existing FCM token for admin ${adminId}`);
    } else {
      // Create new token
      await AdminFcmToken.create({
        admin_id: adminId,
        token: fcm_token,
        device_info: device_info || null,
        last_used: new Date(),
        is_active: true,
      });
      console.log(`✅ Created new FCM token for admin ${adminId}`);
    }

    res.json({ success: true, message: 'FCM token registered successfully' });
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { fcm_token } = req.body;
    if (fcm_token) {
      await AdminFcmToken.update(
        { is_active: false },
        { where: { token: fcm_token } }
      );
      console.log(`✅ Deactivated FCM token on logout`);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};