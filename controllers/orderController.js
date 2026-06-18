const { Order, OrderItem, Product, Address } = require('../models');
const { sequelize } = require('../models');
const { notifyNewOrder } = require('../utils/fcm');

const generateOrderId = () => `ORD-${Date.now()}`;

/**
 * POST /api/orders
 * Place a new order.
 */
exports.placeOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      items,
      address_id,
      delivery_address,
      delivery_slot,
      delivery_date,
      payment_method = 'cod',
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }

    const productIds = items.map((i) => i.product_id);
    const dbProducts = await Product.findAll({
      where: { id: productIds, is_active: true },
    });

    if (dbProducts.length !== items.length) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'One or more products not found or inactive.' });
    }

    const outOfStock = dbProducts.filter((p) => !p.in_stock);
    if (outOfStock.length > 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `The following items are out of stock: ${outOfStock.map((p) => p.name).join(', ')}`,
      });
    }

    let subtotal = 0;
    const orderItemsData = items.map((item) => {
      const product = dbProducts.find((p) => p.id === item.product_id);
      const unitPrice = parseFloat(product.price);
      const qty = parseInt(item.quantity) || 1;
      const totalPrice = parseFloat((unitPrice * qty).toFixed(2));
      subtotal += totalPrice;

      return {
        product_id: product.id,
        product_name: product.name,
        product_type: product.product_type,
        unit: product.unit,
        unit_price: unitPrice,
        quantity: qty,
        total_price: totalPrice,
        emoji: product.emoji,
        image_url: product.image_url,
      };
    });

    subtotal = parseFloat(subtotal.toFixed(2));
    const deliveryFee = subtotal >= 299 ? 0 : 29;
    const appCharge = 2;
    const serviceFee = parseFloat((subtotal * 0.02).toFixed(2));
    const gst = parseFloat(((subtotal + deliveryFee) * 0.05).toFixed(2));
    const total = parseFloat((subtotal + deliveryFee + appCharge + serviceFee + gst).toFixed(2));

    const orderId = generateOrderId();

    const order = await Order.create(
      {
        id: orderId,
        user_id: req.user.id,
        address_id: address_id || null,
        delivery_address,
        delivery_slot,
        delivery_date: delivery_date || null,
        subtotal,
        delivery_fee: deliveryFee,
        app_charge: appCharge,
        service_fee: serviceFee,
        gst,
        total,
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'pending',
        status: 'placed',
        notes: notes || null,
      },
      { transaction: t }
    );

    const createdItems = await OrderItem.bulkCreate(
      orderItemsData.map((i) => ({ ...i, order_id: orderId })),
      { transaction: t }
    );

    await t.commit();

    // Send push notification to admins (do not block response)
    if (typeof notifyNewOrder === 'function') {
      notifyNewOrder(order).catch(err => console.error('FCM notification error:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        order_id: orderId,
        status: order.status,
        subtotal,
        delivery_fee: deliveryFee,
        app_charge: appCharge,
        service_fee: serviceFee,
        gst,
        total,
        payment_method,
        delivery_slot,
        items: createdItems,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * GET /api/orders
 * Returns all orders for the logged-in user
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: [
            'id', 'product_id', 'product_name', 'product_type',
            'unit', 'unit_price', 'quantity', 'total_price', 'emoji', 'image_url',
          ],
        },
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
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Returns single order detail (must belong to logged-in user)
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/orders/:id/cancel
 * Cancel an order (only if status is 'placed' or 'confirmed')
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const cancellable = ['placed', 'confirmed'];
    if (!cancellable.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled at status: ${order.status}`,
      });
    }

    await order.update({ status: 'cancelled' });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully.',
      data: { order_id: order.id, status: 'cancelled' },
    });
  } catch (error) {
    next(error);
  }
};