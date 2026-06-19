// const { Product, Category } = require('../models');
// const fs = require('fs');
// const path = require('path');

// /**
//  * GET /api/admin/products
//  * Returns all products (admin view)
//  */
// exports.getAll = async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'emoji'] }],
//       order: [['sort_order', 'ASC'], ['name', 'ASC']],
//     });
//     res.json({ success: true, data: products });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * GET /api/admin/products/:id
//  * Returns single product
//  */
// exports.getById = async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id, {
//       include: [{ model: Category, as: 'category' }],
//     });
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
//     res.json({ success: true, data: product });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * POST /api/admin/products
//  * Creates a new product (with optional image upload)
//  * Expects multipart/form-data with fields: name, category_id, price, unit, emoji, description, badge, product_type, sort_order
//  * and optional file field 'image'
//  */
// exports.create = async (req, res) => {
//   try {
//     const {
//       name, category_id, price, original_price, unit, emoji, description,
//       badge, product_type, sort_order, in_stock, rating, review_count,
//     } = req.body;

//     let image_url = null;
//     if (req.file) {
//       // Save the uploaded file to a public directory (e.g., /uploads)
//       const fileName = `${Date.now()}_${req.file.originalname}`;
//       const uploadPath = path.join(__dirname, '../public/uploads', fileName);
//       fs.renameSync(req.file.path, uploadPath);
//       image_url = `/uploads/${fileName}`;
//     }

//     const product = await Product.create({
//       name,
//       category_id,
//       price: parseFloat(price),
//       original_price: original_price ? parseFloat(original_price) : null,
//       unit,
//       emoji: emoji || null,
//       image_url,
//       description: description || null,
//       badge: badge || null,
//       product_type: product_type || 'raw',
//       sort_order: sort_order ? parseInt(sort_order) : 0,
//       in_stock: in_stock === 'false' ? false : true,
//       rating: rating ? parseFloat(rating) : 0,
//       review_count: review_count ? parseInt(review_count) : 0,
//     });

//     res.status(201).json({ success: true, data: product });
//   } catch (err) {
//     // Clean up uploaded file if error
//     if (req.file) fs.unlinkSync(req.file.path);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * PUT /api/admin/products/:id
//  * Updates an existing product (with optional image replacement)
//  */
// exports.update = async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

//     const {
//       name, category_id, price, original_price, unit, emoji, description,
//       badge, product_type, sort_order, in_stock, rating, review_count,
//     } = req.body;

//     let image_url = product.image_url;
//     if (req.file) {
//       // Delete old image if exists
//       if (product.image_url) {
//         const oldPath = path.join(__dirname, '../public', product.image_url);
//         if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//       }
//       // Save new image
//       const fileName = `${Date.now()}_${req.file.originalname}`;
//       const uploadPath = path.join(__dirname, '../public/uploads', fileName);
//       fs.renameSync(req.file.path, uploadPath);
//       image_url = `/uploads/${fileName}`;
//     }

//     await product.update({
//       name: name || product.name,
//       category_id: category_id || product.category_id,
//       price: price !== undefined ? parseFloat(price) : product.price,
//       original_price: original_price !== undefined ? (original_price ? parseFloat(original_price) : null) : product.original_price,
//       unit: unit || product.unit,
//       emoji: emoji !== undefined ? (emoji || null) : product.emoji,
//       image_url,
//       description: description !== undefined ? (description || null) : product.description,
//       badge: badge !== undefined ? (badge || null) : product.badge,
//       product_type: product_type || product.product_type,
//       sort_order: sort_order !== undefined ? parseInt(sort_order) : product.sort_order,
//       in_stock: in_stock !== undefined ? (in_stock === 'false' ? false : true) : product.in_stock,
//       rating: rating !== undefined ? parseFloat(rating) : product.rating,
//       review_count: review_count !== undefined ? parseInt(review_count) : product.review_count,
//     });

//     res.json({ success: true, data: product });
//   } catch (err) {
//     if (req.file) fs.unlinkSync(req.file.path);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /**
//  * DELETE /api/admin/products/:id
//  * Deletes a product and its associated image
//  */
// exports.delete = async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id);
//     if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

//     // Delete associated image file
//     if (product.image_url) {
//       const imagePath = path.join(__dirname, '../public', product.image_url);
//       if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
//     }

//     await product.destroy();
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Helper to parse float from string or number
// function parseFloat(value) {
//   const num = typeof value === 'string' ? parseFloat(value) : value;
//   return isNaN(num) ? 0 : num;
// }

const { Product, Category } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper to parse float from string or number (renamed to avoid recursion)
function safeParseFloat(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

// Helper to parse integer
function safeParseInt(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseInt(value) : value;
  return isNaN(num) ? 0 : num;
}

/**
 * GET /api/admin/products
 * Returns all products (admin view)
 */
exports.getAll = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'emoji', 'color'] 
        }
      ],
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/products/:id
 * Returns single product
 */
exports.getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'emoji', 'color'] 
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/products
 * Creates a new product (with optional image upload)
 */
exports.create = async (req, res) => {
  try {
    console.log('📦 Creating product...');
    console.log('Request body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'No file');

    const {
      name, category_id, price, original_price, unit, emoji, description,
      badge, product_type, sort_order, in_stock, rating, review_count,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category_id) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }
    if (!price) {
      return res.status(400).json({ success: false, message: 'Price is required' });
    }
    if (!unit) {
      return res.status(400).json({ success: false, message: 'Unit is required' });
    }

    let image_url = null;
    if (req.file) {
      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const uploadPath = path.join(uploadDir, fileName);
      fs.renameSync(req.file.path, uploadPath);
      image_url = `/uploads/${fileName}`;
      console.log('Image saved:', image_url);
    }

    const product = await Product.create({
      name,
      category_id: safeParseInt(category_id),
      price: safeParseFloat(price),
      original_price: original_price ? safeParseFloat(original_price) : null,
      unit,
      emoji: emoji || null,
      image_url,
      description: description || null,
      badge: badge || null,
      product_type: product_type || 'raw',
      sort_order: sort_order ? safeParseInt(sort_order) : 0,
      in_stock: in_stock === 'false' ? false : true,
      rating: rating ? safeParseFloat(rating) : 0,
      review_count: review_count ? safeParseInt(review_count) : 0,
    });

    // Return product without circular references
    const productData = product.toJSON();
    delete productData.createdAt;
    delete productData.updatedAt;

    console.log('✅ Product created:', product.id);
    res.status(201).json({ success: true, data: productData });
  } catch (err) {
    console.error('❌ Error creating product:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/admin/products/:id
 * Updates an existing product (with optional image replacement)
 */
exports.update = async (req, res) => {
  try {
    console.log('📦 Updating product:', req.params.id);
    console.log('Request body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'No file');

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      name, category_id, price, original_price, unit, emoji, description,
      badge, product_type, sort_order, in_stock, rating, review_count,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }
    if (!category_id) {
      return res.status(400).json({ success: false, message: 'Category ID is required' });
    }
    if (!price) {
      return res.status(400).json({ success: false, message: 'Price is required' });
    }
    if (!unit) {
      return res.status(400).json({ success: false, message: 'Unit is required' });
    }

    let image_url = product.image_url;
    if (req.file) {
      console.log('Processing new image...');
      
      // Delete old image if exists
      if (product.image_url) {
        const oldPath = path.join(__dirname, '../public', product.image_url);
        if (fs.existsSync(oldPath)) {
          try { 
            fs.unlinkSync(oldPath);
            console.log('Deleted old image:', oldPath);
          } catch(e) { 
            console.log('Error deleting old image:', e.message);
          }
        }
      }
      
      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const uploadPath = path.join(uploadDir, fileName);
      fs.renameSync(req.file.path, uploadPath);
      image_url = `/uploads/${fileName}`;
      console.log('New image saved:', image_url);
    }

    // Build update data safely
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category_id !== undefined) updateData.category_id = safeParseInt(category_id);
    if (price !== undefined) updateData.price = safeParseFloat(price);
    if (original_price !== undefined) {
      updateData.original_price = original_price ? safeParseFloat(original_price) : null;
    }
    if (unit !== undefined) updateData.unit = unit;
    if (emoji !== undefined) updateData.emoji = emoji || null;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (description !== undefined) updateData.description = description || null;
    if (badge !== undefined) updateData.badge = badge || null;
    if (product_type !== undefined) updateData.product_type = product_type;
    if (sort_order !== undefined) updateData.sort_order = safeParseInt(sort_order);
    if (in_stock !== undefined) updateData.in_stock = in_stock === 'false' ? false : true;
    if (rating !== undefined) updateData.rating = safeParseFloat(rating);
    if (review_count !== undefined) updateData.review_count = safeParseInt(review_count);

    await product.update(updateData);

    // Fetch updated product without circular references
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'emoji', 'color'] 
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    console.log('✅ Product updated:', product.id);
    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    console.error('❌ Error updating product:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/admin/products/:id
 * Deletes a product and its associated image
 */
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete associated image file
    if (product.image_url) {
      const imagePath = path.join(__dirname, '../public', product.image_url);
      if (fs.existsSync(imagePath)) {
        try { fs.unlinkSync(imagePath); } catch(e) { console.log('Error deleting image:', e); }
      }
    }

    await product.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};