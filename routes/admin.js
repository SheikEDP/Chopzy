

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '_' + cleanName);
  }
});

// File filter - allow only images
const fileFilter = (req, file, cb) => {
  console.log('📸 File details:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    encoding: file.encoding
  });
  
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg', 'image/bmp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  
  const isValidMime = allowedMimeTypes.includes(file.mimetype);
  const isValidExt = allowedExtensions.includes(ext);
  
  if (isValidMime || isValidExt) {
    console.log('✅ File accepted:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname, 'MIME:', file.mimetype);
    cb(new Error(`Only images are allowed (JPEG, PNG, GIF, WEBP). Received: ${file.mimetype}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

// ── Middleware to handle file upload ──
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.log('❌ Upload error:', err.message);
      if (err.message.includes('Only images')) {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    console.log('✅ File uploaded:', req.file ? req.file.filename : 'No file');
    next();
  });
};

const { adminProtect } = require('../middleware/adminAuth');
const adminAuth = require('../controllers/adminAuthController');
const adminCategory = require('../controllers/adminCategoryController');
const adminProduct = require('../controllers/adminProductController');
const adminOrder = require('../controllers/adminOrderController');
const adminConfig = require('../controllers/adminConfigController');
const adminDeliverySlot = require('../controllers/adminDeliverySlotController'); // ADD THIS

// Auth
router.post('/login', adminAuth.login);
router.post('/fcm-token', adminProtect, adminAuth.registerFcmToken);

// Dashboard
router.get('/dashboard', adminProtect, adminOrder.getDashboardStats);

// Categories
router.get('/categories', adminProtect, adminCategory.getAll);
router.post('/categories', adminProtect, handleUpload, adminCategory.create);
router.put('/categories/:id', adminProtect, handleUpload, adminCategory.update);
router.delete('/categories/:id', adminProtect, adminCategory.delete);

// Products
router.get('/products', adminProtect, adminProduct.getAll);
router.get('/products/:id', adminProtect, adminProduct.getById);
router.post('/products', adminProtect, handleUpload, adminProduct.create);
router.put('/products/:id', adminProtect, handleUpload, adminProduct.update);
router.delete('/products/:id', adminProtect, adminProduct.delete);

// Orders
router.get('/orders', adminProtect, adminOrder.getAll);
router.get('/orders/:id', adminProtect, adminOrder.getById);
router.patch('/orders/:id/status', adminProtect, adminOrder.updateStatus);

// ── Delivery Slots ── ADD THIS SECTION
router.get('/delivery-slots', adminProtect, adminDeliverySlot.getAll);
router.post('/delivery-slots', adminProtect, adminDeliverySlot.create);
router.put('/delivery-slots/:id', adminProtect, adminDeliverySlot.update);
router.patch('/delivery-slots/:id/toggle', adminProtect, adminDeliverySlot.toggleActive);
router.delete('/delivery-slots/:id', adminProtect, adminDeliverySlot.delete);

// ── Config ──
router.get('/config', adminProtect, adminConfig.get);
router.put('/config', adminProtect, adminConfig.update);

module.exports = router;