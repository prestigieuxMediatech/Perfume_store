const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.googleCallback = (req,res) => {
    const token = jwt.sign(
    {
        id : req.user.id,
        email : req.user.email,
        name : req.user.name
    },
    process.env.JWT_SECRET,
    {expiresIn:'7d'}
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
}

exports.getMe = async(req,res) => {
    try{
        const rows = await pool.query(
            'SELECT id,name,email,avatar,created_at FROM users WHERE ID=?',
            [req.user.id]
        );
        if(rows.length === 0){
            return res.status(404).json({error:'User Not Found'});
        }
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}
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

    res.status(200).json(rows);
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

    await pool.query(
      `UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, id, req.user.id]
    );

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

    await pool.query(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

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
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};