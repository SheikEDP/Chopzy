// controllers/authController.js
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const axios   = require('axios');           // for Robeeta SMS
const { Op }  = require('sequelize');
const { User, Otp } = require('../models');

// ── Helpers ───────────────────────────────────────────────────────────────────

const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000)); // 6-digit

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Send OTP via Robeeta SMS (your existing provider).
 * In development / if keys are not set, the OTP is returned in the response for testing.
 */
const sendSmsOtp = async (phone, otp) => {
  const apiKey = process.env.ROBEETA_API_KEY;
  
  // Always try to send SMS (ignore NODE_ENV)
  if (apiKey) {
    try {
      const msgdetail = `Your Verification Code is ${otp}. Valid for 15 min only. - Derik Group`;
      const encodedMsg = encodeURIComponent(msgdetail);
      const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${process.env.ROBEETA_TEMPLATE_ID}&sid=${process.env.ROBEETA_SENDER_ID}&to=${phone}&msg=${encodedMsg}`;
      
      console.log('📤 Sending SMS to:', phone);
      console.log('📝 Message:', msgdetail);
      
      const response = await axios.get(url);
      console.log('✅ SMS API Response:', response.data);
      return true;
    } catch (err) {
      console.error('❌ SMS send error:', err.message);
      return false;
    }
  } else {
    console.log(`⚠️ No API key - OTP for ${phone}: ${otp}`);
    return false;
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/auth/send-otp
 * Body: { phone: "+919876543210" }
 */
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    // Invalidate any existing unused OTPs for this phone
    await Otp.update(
      { is_used: true },
      { where: { phone, is_used: false } }
    );

    const otp = generateOtp();
    const expiresAt = new Date(
      Date.now() + (parseInt(process.env.OTP_EXPIRES_MINUTES) || 10) * 60 * 1000
    );

    await Otp.create({
      phone,
      otp_code: otp,
      expires_at: expiresAt,
    });

    // Send SMS - always try
    const smsSent = await sendSmsOtp(phone, otp);
    
    // Always return OTP in development for testing
    const responseData = { 
      success: true, 
      message: smsSent ? 'OTP sent successfully.' : 'OTP generated (SMS failed).'
    };
    
    // Return OTP for testing (remove in production)
    responseData.dev_otp = otp;
    
    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Body: { phone: "+919876543210", otp: "123456" }
 */
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;
    console.log('🔐 Verifying OTP:', otp, 'for phone:', phone);

    const otpRecord = await Otp.findOne({
      where: {
        phone,
        otp_code: otp,
        is_used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['created_at', 'DESC']],
    });

    if (!otpRecord) {
      console.log('❌ Invalid or expired OTP');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please try again.',
      });
    }

    // Mark OTP as used
    await otpRecord.update({ is_used: true });

    // Find or create user
    const [user, created] = await User.findOrCreate({
      where: { phone },
      defaults: {
        phone,
        is_verified: true,
        last_login: new Date(),
      },
    });

    if (!created) {
      await user.update({ is_verified: true, last_login: new Date() });
    }

    const token = generateToken(user.id);
    console.log('✅ Login successful, token generated:', token.substring(0, 50) + '...');

    // IMPORTANT: Send token in the response
    res.status(200).json({
      success: true,
      message: created ? 'Account created & logged in.' : 'Login successful.',
      data: {
        token: token,  // Make sure token is included here
        is_new_user: created,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          is_verified: user.is_verified,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns current logged-in user profile
 */
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user.id,
      phone: req.user.phone,
      name: req.user.name,
      email: req.user.email,
      avatar_url: req.user.avatar_url,
      is_verified: req.user.is_verified,
      last_login: req.user.last_login,
      created_at: req.user.created_at,
    },
  });
};

/**
 * PUT /api/auth/profile
 * Update user profile fields (name, email, avatar_url)
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar_url } = req.body;
    await req.user.update({ name, email, avatar_url });
    res.status(200).json({
      success: true,
      message: 'Profile updated.',
      data: {
        id: req.user.id,
        phone: req.user.phone,
        name: req.user.name,
        email: req.user.email,
        avatar_url: req.user.avatar_url,
      },
    });
  } catch (error) {
    next(error);
  }
};
