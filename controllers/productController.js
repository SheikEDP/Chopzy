// controllers/productController.js
const { Op }              = require('sequelize');
const { Product, Category } = require('../models');

/**
 * GET /api/products
 * Query params:
 *   category   - category name (e.g. "Vegetables") or category id
 *   type       - "raw" | "cut"
 *   search     - search by product name
 *   in_stock   - "true" | "false"
 *   badge      - filter by badge text
 *   page       - page number (default 1)
 *   limit      - items per page (default 20)
 */
exports.getAll = async (req, res, next) => {
  try {
    const {
      category,      // category name
      category_id,   // category id
      type,
      search,
      in_stock,
      badge,
      page = 1,
      limit = 20,
    } = req.query;

    const where = { is_active: true };

    // product type filter
    if (type && ['raw', 'cut'].includes(type.toLowerCase())) {
      where.product_type = type.toLowerCase();
    }

    // in_stock filter
    if (in_stock !== undefined) {
      where.in_stock = in_stock === 'true';
    }

    // badge filter
    if (badge) {
      where.badge = { [Op.like]: `%${badge}%` };
    }

    // search by name
    if (search && search.trim()) {
      where.name = { [Op.like]: `%${search.trim()}%` };
    }

    // category filter - FIXED to support both name and id
    const categoryWhere = { is_active: true };
    if (category) {
      categoryWhere.name = { [Op.like]: `%${category}%` };
    }
    if (category_id) {
      categoryWhere.id = parseInt(category_id);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          where: categoryWhere,
          attributes: ['id', 'name', 'emoji', 'color'],
        },
      ],
      order: [
        ['sort_order', 'ASC'],
        ['name', 'ASC'],
      ],
      limit: parseInt(limit),
      offset,
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        total_pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, is_active: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'emoji', 'color'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/featured
 * Returns top-rated / best-seller products (rating >= 4.7)
 */
exports.getFeatured = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        is_active: true,
        in_stock: true,
        rating: { [Op.gte]: 4.7 },
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'emoji'],
        },
      ],
      order: [['rating', 'DESC'], ['review_count', 'DESC']],
      limit: 10,
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/search?q=tomato
 */
exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required.' });
    }

    const products = await Product.findAll({
      where: {
        is_active: true,
        name: { [Op.like]: `%${q}%` },
      },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'emoji'] },
      ],
      order: [['rating', 'DESC']],
      limit: 20,
    });

    res.status(200).json({ success: true, data: products, query: q });
  } catch (error) {
    next(error);
  }
};
