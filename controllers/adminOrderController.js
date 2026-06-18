const { Order, OrderItem, Product, Address, User } = require('../models');

/**
 * GET /api/admin/orders
 * Returns all orders with optional status filter (Admin view)
 */
exports.getAll = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items', // Use the alias defined in associations
        },
        {
          model: User,
          as: 'user', // IMPORTANT: Use the 'as' keyword with the alias
          attributes: ['id', 'phone', 'name', 'email'],
        },
        // If you want to include Address as well:
        // {
        //   model: Address,
        //   as: 'address',
        //   attributes: ['id', 'label', 'full_address'],
        // },
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
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
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/orders/:id
 * Returns single order details
 */
exports.getById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'phone', 'name', 'email'],
        },
        {
          model: Address,
          as: 'address',
          attributes: ['id', 'label', 'full_address'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/admin/orders/:id/status
 * Update order status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    await order.update({ status });

    res.status(200).json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/dashboard
 * Returns dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    const pendingOrders = await Order.count({ where: { status: 'placed' } });
    const totalCustomers = await User.count();

    // Calculate total revenue
    const revenueResult = await Order.sum('total', {
      where: { status: 'delivered' },
    });
    const totalRevenue = revenueResult || 0;

    // Recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'phone', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        total_orders: totalOrders,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        total_customers: totalCustomers,
        recent_orders: recentOrders,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};