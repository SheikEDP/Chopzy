// // controllers/categoryController.js
// const { Category, Product } = require('../models');

// /**
//  * GET /api/categories
//  * Returns all active categories sorted by sort_order
//  */
// exports.getAll = async (req, res, next) => {
//   try {
//     const categories = await Category.findAll({
//       where: { is_active: true },
//       order: [['sort_order', 'ASC'], ['name', 'ASC']],
//       attributes: ['id', 'name', 'emoji', 'color', 'image_url', 'description'],
//     });

//     res.status(200).json({ success: true, data: categories });
//   } catch (error) {
//     next(error);
//   }
// };

// /**
//  * GET /api/categories/:id
//  * Returns single category with product count
//  */
// exports.getById = async (req, res, next) => {
//   try {
//     const category = await Category.findOne({
//       where: { id: req.params.id, is_active: true },
//     });

//     if (!category) {
//       return res.status(404).json({ success: false, message: 'Category not found.' });
//     }

//     const productCount = await Product.count({
//       where: { category_id: category.id, is_active: true },
//     });

//     res.status(200).json({
//       success: true,
//       data: { ...category.toJSON(), product_count: productCount },
//     });
//   } catch (error) {
//     next(error);
//   }
// };


// controllers/categoryController.js
const { Category, Product } = require('../models');

/**
 * GET /api/categories
 * Returns all active categories sorted by sort_order
 */
exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC'], ['name', 'ASC']],
      attributes: ['id', 'name', 'emoji', 'color', 'image_url', 'description', 'type'],
    });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:id
 * Returns single category with product count
 */
exports.getById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, is_active: true },
      attributes: ['id', 'name', 'emoji', 'color', 'image_url', 'description', 'type', 'sort_order', 'is_active'],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const productCount = await Product.count({
      where: { category_id: category.id, is_active: true },
    });

    res.status(200).json({
      success: true,
      data: { ...category.toJSON(), product_count: productCount },
    });
  } catch (error) {
    next(error);
  }
};