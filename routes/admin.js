const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { adminProtect } = require('../middleware/adminAuth');
const adminAuth = require('../controllers/adminAuthController');
const adminCategory = require('../controllers/adminCategoryController');
const adminProduct = require('../controllers/adminProductController');
const adminOrder = require('../controllers/adminOrderController');
const adminConfig = require('../controllers/adminConfigController');

// Auth
router.post('/login', adminAuth.login);
router.post('/fcm-token', adminProtect, adminAuth.registerFcmToken);

// Dashboard
router.get('/dashboard', adminProtect, adminOrder.getDashboardStats);

// Categories
router.get('/categories', adminProtect, adminCategory.getAll);
router.post('/categories', adminProtect, adminCategory.create);
router.put('/categories/:id', adminProtect, adminCategory.update);
router.delete('/categories/:id', adminProtect, adminCategory.delete);

// Products
router.get('/products', adminProtect, adminProduct.getAll);
router.get('/products/:id', adminProtect, adminProduct.getById);
router.post('/products', adminProtect, upload.single('image'), adminProduct.create);
router.put('/products/:id', adminProtect, upload.single('image'), adminProduct.update);
router.delete('/products/:id', adminProtect, adminProduct.delete);

// Orders
router.get('/orders', adminProtect, adminOrder.getAll);
router.get('/orders/:id', adminProtect, adminOrder.getById);
router.patch('/orders/:id/status', adminProtect, adminOrder.updateStatus);

// Config
router.get('/config', adminProtect, adminConfig.get);
router.put('/config', adminProtect, adminConfig.update);

module.exports = router;