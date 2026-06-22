


const { Category } = require('../models');
const fs = require('fs');
const path = require('path');

// Helper to parse integer safely (renamed to avoid recursion)
function safeParseInt(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseInt(value) : value;
  return isNaN(num) ? 0 : num;
}

// Helper to check if value is a valid number
function isValidNumber(value) {
  return value !== null && value !== undefined && value !== '' && !isNaN(value);
}

/**
 * GET /api/admin/categories
 * Returns all categories
 */
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/categories
 * Creates a new category with image
 */
exports.create = async (req, res) => {
  try {
    console.log('📦 Creating category...');
    console.log('Request body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'No file');

    const { name, emoji, color, description, sort_order } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
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

    const category = await Category.create({
      name,
      emoji: emoji || '📦',
      color: color || '#2E7D32',
      image_url,
      description: description || null,
      sort_order: safeParseInt(sort_order),
    });

    // Return category without circular references
    const categoryData = category.toJSON();
    delete categoryData.createdAt;
    delete categoryData.updatedAt;

    console.log('✅ Category created:', category.id);
    res.status(201).json({ success: true, data: categoryData });
  } catch (err) {
    console.error('❌ Error creating category:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/admin/categories/:id
 * Updates a category with optional image
 */
exports.update = async (req, res) => {
  try {
    console.log('📦 Updating category:', req.params.id);
    console.log('Request body:', req.body);
    console.log('File:', req.file ? req.file.filename : 'No file');

    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, emoji, color, description, sort_order } = req.body;

    let image_url = category.image_url;
    
    // If a new image was uploaded
    if (req.file) {
      console.log('Processing new image...');
      
      // Delete old image if exists
      if (category.image_url) {
        const oldPath = path.join(__dirname, '../public', category.image_url);
        if (fs.existsSync(oldPath)) {
          try { 
            fs.unlinkSync(oldPath);
            console.log('Deleted old image:', oldPath);
          } catch(e) { 
            console.log('Error deleting old image:', e.message);
          }
        }
      }
      
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, '../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Save new image
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const uploadPath = path.join(uploadDir, fileName);
      fs.renameSync(req.file.path, uploadPath);
      image_url = `/uploads/${fileName}`;
      console.log('✅ New image saved:', image_url);
    }

    // Build update data safely
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (emoji !== undefined) updateData.emoji = emoji || null;
    if (color !== undefined) updateData.color = color;
    if (image_url !== undefined) updateData.image_url = image_url; // ✅ Make sure this is set
    if (description !== undefined) updateData.description = description || null;
    if (sort_order !== undefined) updateData.sort_order = safeParseInt(sort_order);

    // Update category
    await category.update(updateData);

    // Fetch updated category
    const updatedCategory = await Category.findByPk(req.params.id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    console.log('✅ Category updated:', category.id, 'Image URL:', image_url);
    res.json({ success: true, data: updatedCategory });
  } catch (err) {
    console.error('❌ Error updating category:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch(e) {}
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/admin/categories/:id
 * Deletes a category
 */
exports.delete = async (req, res) => {
  try {
    console.log('🗑️ Deleting category:', req.params.id);
    
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Delete associated image file
    if (category.image_url) {
      const imagePath = path.join(__dirname, '../public', category.image_url);
      if (fs.existsSync(imagePath)) {
        try { 
          fs.unlinkSync(imagePath); 
          console.log('Deleted image:', imagePath);
        } catch(e) { 
          console.log('Error deleting image:', e.message);
        }
      }
    }

    await category.destroy();
    console.log('✅ Category deleted:', req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting category:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};