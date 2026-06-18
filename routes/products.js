// routes/products.js
const express           = require('express');
const router            = express.Router();
const productController = require('../controllers/productController');

// Note: /search and /featured must come before /:id to avoid route conflicts
router.get('/search',    productController.search);
router.get('/featured',  productController.getFeatured);
router.get('/',          productController.getAll);
router.get('/:id',       productController.getById);

module.exports = router;
