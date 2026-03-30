const pool = require('../config/db');
const crypto = require('crypto');

const REQUIRED_FIELDS = [
  'full_name',
  'phone',
  'email',
  'address_line1',
  'city',
  'state',
  'postal_code',
  'country'
];

const allowedStatuses = new Set([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'paid'
]);

const normalize = (value) => (typeof value === 'string' ? value.trim() : value);

const validateOrderInput = (body) => {
  const errors = {};
  REQUIRED_FIELDS.forEach((field) => {
    const value = normalize(body[field]);
    if (!value) errors[field] = `${field.replace('_', ' ')} is required`;
  });

  if (body.email) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);
    if (!emailOk) errors.email = 'Invalid email address';
  }

  if (body.phone && String(body.phone).length < 6) {
    errors.phone = 'Phone number looks too short';
  }

  return errors;
};

const calculateTotals = (items) => {
  let subtotal = 0;
  const lineItems = items.map((item) => {
    const unit = Number(item.discount_price || item.price) || 0;
    const qty = Number(item.quantity) || 0;
    const line_total = unit * qty;
    subtotal += line_total;
    return {
      ...item,
      unit_price: unit,
      line_total
    };
  });

  const shipping_fee = 0;
  const tax_total = 0;
  const discount_total = 0;
  const grand_total = subtotal + shipping_fee + tax_total - discount_total;

  return { subtotal, shipping_fee, tax_total, discount_total, grand_total, lineItems };
};

exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const payload = req.body || {};
  const errors = validateOrderInput(payload);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Invalid order data', errors });
  }

  const payment_method = payload.payment_method || 'COD';

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartItems] = await connection.query(`
      SELECT
        ci.id,
        ci.quantity,
        p.id          AS product_id,
        pv.id         AS variant_id,
        pv.price,
        pv.discount_price
      FROM cart_items ci
      JOIN products p           ON ci.product_id = p.id
      JOIN product_variants pv  ON ci.variant_id  = pv.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]);

    if (!cartItems || cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totals = calculateTotals(cartItems);
    const orderId = crypto.randomUUID();

    await connection.query(`
      INSERT INTO orders (
        id, user_id, full_name, phone, email, address_line1, address_line2,
        city, state, postal_code, country,
        subtotal, discount_total, shipping_fee, tax_total, grand_total,
        status, payment_status, payment_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId,
      userId,
      normalize(payload.full_name),
      normalize(payload.phone),
      normalize(payload.email),
      normalize(payload.address_line1),
      normalize(payload.address_line2) || null,
      normalize(payload.city),
      normalize(payload.state),
      normalize(payload.postal_code),
      normalize(payload.country) || 'India',
      totals.subtotal,
      totals.discount_total,
      totals.shipping_fee,
      totals.tax_total,
      totals.grand_total,
      'pending',
      payment_method === 'COD' ? 'unpaid' : 'paid',
      payment_method
    ]);

    for (const item of totals.lineItems) {
      await connection.query(`
        INSERT INTO order_details (
          id, order_id, product_id, variant_id, quantity,
          unit_price, discount_price, line_total
        ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderId,
        item.product_id,
        item.variant_id,
        item.quantity,
        item.unit_price,
        item.discount_price || null,
        item.line_total
      ]);
    }

    await connection.query(
      `DELETE FROM cart_items WHERE user_id = ?`,
      [userId]
    );

    await connection.commit();

    res.status(201).json({ order_id: orderId });
  } catch (err) {
    await connection.rollback();
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(`
      SELECT o.*, o.grand_total AS total_amount
      FROM orders o
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    const orderIds = orders.map((o) => o.id);
    const [items] = await pool.query(`
      SELECT
        od.id,
        od.order_id,
        od.product_id,
        od.variant_id,
        od.quantity,
        od.unit_price,
        od.discount_price,
        od.line_total,
        p.name AS product_name,
        pv.size AS size,
        pi.image_url AS image
      FROM order_details od
      JOIN products p ON od.product_id = p.id
      LEFT JOIN product_variants pv ON od.variant_id = pv.id
      LEFT JOIN product_images pi
        ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE od.order_id IN (?)
      ORDER BY od.id ASC
    `, [orderIds]);

    const itemsByOrder = new Map();
    for (const order of orders) {
      itemsByOrder.set(order.id, []);
    }
    items.forEach((item) => {
      if (!itemsByOrder.has(item.order_id)) itemsByOrder.set(item.order_id, []);
      itemsByOrder.get(item.order_id).push(item);
    });

    const response = orders.map((order) => ({
      ...order,
      items: itemsByOrder.get(order.id) || []
    }));

    res.status(200).json(response);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT
        o.id,
        o.status,
        o.created_at,
        o.grand_total AS total_amount,
        u.name AS user_name
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Admin orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!status || !allowedStatuses.has(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, id]
    );

    res.status(200).json({ message: 'Order status updated' });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
