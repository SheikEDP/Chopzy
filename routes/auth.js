// routes/auth.js
const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect }    = require('../middleware/auth');
const { validate }   = require('../middleware/errorHandler');

// Validation rules
const phoneRules = [
  body('phone')
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[1-9]\d{9,14}$/).withMessage('Enter a valid phone number (e.g. +919876543210).'),
];

const otpRules = [
  ...phoneRules,
  body('otp')
    .notEmpty().withMessage('OTP is required.')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits.')
    .isNumeric().withMessage('OTP must be numeric.'),
];

// ── Routes ────────────────────────────────────────────────────────────────────
router.post('/send-otp',    phoneRules, validate, authController.sendOtp);
router.post('/verify-otp',  otpRules,   validate, authController.verifyOtp);
router.get('/me',           protect,              authController.getMe);
router.put('/profile',      protect,
  [
    body('email').optional().isEmail().withMessage('Enter a valid email.'),
    body('name').optional().isLength({ max: 100 }).withMessage('Name too long.'),
  ],
  validate,
  authController.updateProfile
);

module.exports = router;
