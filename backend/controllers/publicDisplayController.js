const pool = require('../config/db');

// GET /api/products — public, no auth needed
exports.getPublicProducts = async (req, res) => {
  try {
    const { category, brand, sort } = req.query;

    let query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.is_active,
        c.name       AS category_name,
        c.slug       AS category_slug,
        b.name       AS brand_name,
        b.slug       AS brand_slug,
        pi.image_url AS primary_image
      FROM products p
      LEFT JOIN categories c  ON p.category_id = c.id
      LEFT JOIN brands b      ON p.brand_id = b.id
      LEFT JOIN product_images pi
        ON p.id = pi.product_id AND pi.is_primary = TRUE
      WHERE p.is_active = TRUE
    `;

    const params = [];

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (brand) {
      query += ` AND b.slug = ?`;
      params.push(brand);
    }

    // Sorting
    if (sort === 'newest')     query += ` ORDER BY p.created_at DESC`;
    else if (sort === 'a-z')   query += ` ORDER BY p.name ASC`;
    else                       query += ` ORDER BY p.created_at DESC`;

    const [products] = await pool.query(query, params);

    // Attach variants to each product
    for (const product of products) {
      const [variants] = await pool.query(
        `SELECT id, size, price, discount_price
         FROM product_variants
         WHERE product_id = ?
         ORDER BY price ASC`,
        [product.id]
      );
      product.variants      = variants;
      product.starting_price = variants.length > 0 ? variants[0].price : null;
    }

    res.status(200).json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id — single product public
exports.getPublicProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(`
      SELECT
        p.*,
        c.name  AS category_name,
        c.slug  AS category_slug,
        b.name  AS brand_name,
        b.slug  AS brand_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b     ON p.brand_id = b.id
      WHERE p.id = ? AND p.is_active = TRUE
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [images] = await pool.query(
      `SELECT * FROM product_images WHERE product_id = ?`, [id]
    );

    const [variants] = await pool.query(
      `SELECT * FROM product_variants
       WHERE product_id = ? ORDER BY price ASC`, [id]
    );

    res.status(200).json({ ...products[0], images, variants });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/categories — public
exports.getPublicCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, slug FROM categories ORDER BY name ASC`
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/brands — public
exports.getPublicBrands = async (req, res) => {
  try {
    const { category } = req.query;
    let query  = `SELECT b.id, b.name, b.slug, b.category_id FROM brands b`;
    const params = [];

    if (category) {
      query += ` LEFT JOIN categories c ON b.category_id = c.id WHERE c.slug = ?`;
      params.push(category);
    }

    query += ` ORDER BY b.name ASC`;
    const [rows] = await pool.query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};