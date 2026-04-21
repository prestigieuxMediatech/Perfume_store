const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../config/db');
const { clearAuthCookie, setAuthCookie } = require('../utils/authCookies');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildUserToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const splitDisplayName = (name = '') => {
  const cleaned = name.trim().replace(/\s+/g, ' ');
  if (!cleaned) return { firstName: '', lastName: '' };

  const [firstName, ...rest] = cleaned.split(' ');
  return {
    firstName,
    lastName: rest.join(' '),
  };
};

const sanitizePhone = (phone = '') => phone.trim();

const mapUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  first_name: user.first_name || null,
  last_name: user.last_name || null,
  email: user.email,
  phone: user.phone || null,
  avatar: user.avatar || null,
  created_at: user.created_at,
});

exports.signup = async (req, res) => {
  try {
    const firstName = req.body.first_name?.trim() || '';
    const lastName = req.body.last_name?.trim() || '';
    const email = normalizeEmail(req.body.email);
    const phone = sanitizePhone(req.body.phone);
    const password = req.body.password || '';

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const [existingUsers] = await pool.query(
      'SELECT id, google_id, password_hash FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();
    const name = `${firstName} ${lastName}`.trim();

    await pool.query(
      `INSERT INTO users (id, name, first_name, last_name, email, phone, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, firstName, lastName, email, phone, passwordHash]
    );

    const [users] = await pool.query(
      `SELECT id, name, first_name, last_name, email, phone, avatar, created_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    const user = users[0];
    const token = buildUserToken(user);
    setAuthCookie(res, token, 'user');

    res.status(201).json({
      user: mapUserResponse(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [users] = await pool.query(
      `SELECT id, name, first_name, last_name, email, phone, avatar, password_hash, google_id, is_active, created_at
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (!users.length) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ message: 'Your account is inactive.' });
    }

    if (!user.password_hash) {
      return res.status(400).json({
        message: user.google_id
          ? 'This account uses Google sign-in. Please continue with Google.'
          : 'Password login is not available for this account.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = buildUserToken(user);
    setAuthCookie(res, token, 'user');

    res.status(200).json({
      user: mapUserResponse(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const parseSelections = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

exports.googleCallback = (req,res) => {
    const token = buildUserToken(req.user);
    setAuthCookie(res, token, 'user');
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
}

exports.getMe = async(req,res) => {
    try{
        const [rows] = await pool.query(
            'SELECT id,name,first_name,last_name,email,phone,avatar,created_at FROM users WHERE ID=?',
            [req.user.id]
        );
        if(rows.length === 0){
            return res.status(404).json({error:'User Not Found'});
        }
        res.json(mapUserResponse(rows[0]));
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.logout = async (req, res) => {
  clearAuthCookie(res, 'user');
  res.status(200).json({ message: 'Logged out successfully' });
}

exports.addProductReview = async (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;
    const normalizedTitle = (title || '').trim();
    const normalizedComment = (comment || '').trim();
    const numericRating = Number(rating);

    if (!product_id || !normalizedComment || !Number.isInteger(numericRating)) {
      return res.status(400).json({ message: 'Product, rating, and review text are required.' });
    }

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const [products] = await pool.query(
      'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    );

    if (!products.length) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const [existingReview] = await pool.query(
      'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?',
      [product_id, req.user.id]
    );

    if (existingReview.length) {
      await pool.query(
        `UPDATE product_reviews
         SET rating = ?, title = ?, comment = ?
         WHERE id = ?`,
        [numericRating, normalizedTitle || null, normalizedComment, existingReview[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO product_reviews (id, product_id, user_id, rating, title, comment)
         VALUES (UUID(), ?, ?, ?, ?, ?)`,
        [product_id, req.user.id, numericRating, normalizedTitle || null, normalizedComment]
      );
    }

    res.status(200).json({ message: 'Review saved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// GET /api/wishlist — get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        w.id,
        p.id          AS product_id,
        p.name,
        p.description,
        c.name        AS category_name,
        b.name        AS brand_name,
        pi.image_url  AS image,
        MIN(pv.price) AS price
      FROM wishlists w
      JOIN products p       ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b     ON p.brand_id = b.id
      LEFT JOIN product_images pi
        ON p.id = pi.product_id AND pi.is_primary = TRUE
      LEFT JOIN product_variants pv ON p.id = pv.product_id
      WHERE w.user_id = ?
      GROUP BY w.id, p.id, p.name, p.description, c.name, b.name, pi.image_url
      ORDER BY w.created_at DESC
    `, [req.user.id]);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/wishlist — add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check product exists
    const [product] = await pool.query(
      'SELECT id FROM products WHERE id = ?', [product_id]
    );
    if (product.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Insert — ignore if already exists (UNIQUE KEY handles duplicate)
    await pool.query(
      `INSERT IGNORE INTO wishlists (id, user_id, product_id)
       VALUES (UUID(), ?, ?)`,
      [req.user.id, product_id]
    );

    res.status(201).json({ message: 'Added to wishlist' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM wishlists WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromShopWishlist = async (req, res) => {
  try {
    const product_id = req.params.id;

    await pool.query(
      'DELETE FROM wishlists WHERE product_id = ? AND user_id = ?',
      [product_id, req.user.id]
    );

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/wishlist/ids — just product IDs, used to check if product is wishlisted
exports.getWishlistIds = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT product_id FROM wishlists WHERE user_id = ?',
      [req.user.id]
    );
    res.status(200).json(rows.map(r => r.product_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/cart
exports.getCart = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        ci.id,
        ci.quantity,
        ci.created_at,
        'product' AS item_type,
        p.id          AS product_id,
        p.name,
        p.description,
        pv.id         AS variant_id,
        pv.size,
        pv.price,
        pv.discount_price,
        b.name        AS brand_name,
        c.name        AS category_name,
        pi.image_url  AS image
      FROM cart_items ci
      JOIN products p           ON ci.product_id = p.id
      JOIN product_variants pv  ON ci.variant_id  = pv.id
      LEFT JOIN brands b        ON p.brand_id     = b.id
      LEFT JOIN categories c    ON p.category_id  = c.id
      LEFT JOIN product_images pi
        ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [req.user.id]);

    const [boxRows] = await pool.query(`
      SELECT
        cbi.id,
        cbi.quantity,
        cbi.created_at,
        'box' AS item_type,
        b.id AS box_id,
        b.name,
        b.description,
        b.price,
        cbi.selections_json
      FROM cart_box_items cbi
      JOIN boxes b ON cbi.box_id = b.id
      WHERE cbi.user_id = ?
      ORDER BY cbi.created_at DESC
    `, [req.user.id]);

    const combined = [...rows, ...boxRows].sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return db - da;
    });

    res.status(200).json(combined);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, variant_id, quantity = 1 } = req.body;

    if (!product_id || !variant_id) {
      return res.status(400).json({ message: 'Product and variant are required' });
    }

    // Check variant exists and belongs to product
    const [variant] = await pool.query(
      `SELECT id FROM product_variants WHERE id = ? AND product_id = ?`,
      [variant_id, product_id]
    );
    if (variant.length === 0) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    // If already in cart — increase quantity
    const [existing] = await pool.query(
      `SELECT id, quantity FROM cart_items WHERE user_id = ? AND variant_id = ?`,
      [req.user.id, variant_id]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
        [quantity, existing[0].id]
      );
      return res.status(200).json({ message: 'Cart updated' });
    }

    // Insert new cart item
    await pool.query(
      `INSERT INTO cart_items (id, user_id, product_id, variant_id, quantity)
       VALUES (UUID(), ?, ?, ?, ?)`,
      [req.user.id, product_id, variant_id, quantity]
    );

    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/cart/:id — update quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { id }       = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const [result] = await pool.query(
      `UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, id, req.user.id]
    );
    if (result.affectedRows === 0) {
      await pool.query(
        `UPDATE cart_box_items SET quantity = ? WHERE id = ? AND user_id = ?`,
        [quantity, id, req.user.id]
      );
    }

    res.status(200).json({ message: 'Quantity updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/auth/cart/:id — remove item
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );
    if (result.affectedRows === 0) {
      await pool.query(
        `DELETE FROM cart_box_items WHERE id = ? AND user_id = ?`,
        [id, req.user.id]
      );
    }

    res.status(200).json({ message: 'Removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/auth/cart — clear entire cart
exports.clearCart = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM cart_items WHERE user_id = ?`,
      [req.user.id]
    );
    await pool.query(
      `DELETE FROM cart_box_items WHERE user_id = ?`,
      [req.user.id]
    );
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/cart/box
exports.addBoxToCart = async (req, res) => {
  try {
    const { box_id, selections, quantity = 1 } = req.body;
    if (!box_id) return res.status(400).json({ message: 'Box is required' });

    const [boxes] = await pool.query(
      `SELECT id, price, items_count, is_active FROM boxes WHERE id = ?`,
      [box_id]
    );
    if (!boxes.length || !boxes[0].is_active) {
      return res.status(404).json({ message: 'Box not found' });
    }

    const selectionsList = parseSelections(selections);
    if (selectionsList.length !== Number(boxes[0].items_count)) {
      return res.status(400).json({ message: 'Invalid selection count' });
    }

    const [allowedRows] = await pool.query(
      `SELECT category_id FROM box_allowed_categories WHERE box_id = ?`,
      [box_id]
    );
    const allowed = new Set(allowedRows.map(r => r.category_id));

    for (const item of selectionsList) {
      if (!item.product_id || !item.variant_id) {
        return res.status(400).json({ message: 'Each selection needs product and variant' });
      }
      const [product] = await pool.query(
        `SELECT id, category_id FROM products WHERE id = ? AND is_active = TRUE`,
        [item.product_id]
      );
      if (!product.length || !allowed.has(product[0].category_id)) {
        return res.status(400).json({ message: 'Selection category not allowed' });
      }
      const [variant] = await pool.query(
        `SELECT id FROM product_variants WHERE id = ? AND product_id = ?`,
        [item.variant_id, item.product_id]
      );
      if (!variant.length) {
        return res.status(400).json({ message: 'Selection variant invalid' });
      }
    }

    await pool.query(
      `INSERT INTO cart_box_items (id, user_id, box_id, quantity, selections_json, price)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        box_id,
        Number(quantity) || 1,
        JSON.stringify(selectionsList),
        Number(boxes[0].price)
      ]
    );

    res.status(201).json({ message: 'Box added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
