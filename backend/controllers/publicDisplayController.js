const pool = require('../config/db');
const { parseProductDetails } = require('../utils/productDetails');

const getProductReviewsData = async (productId) => {
  const [reviews] = await pool.query(
    `
      SELECT
        pr.id,
        pr.rating,
        pr.title,
        pr.comment,
        pr.created_at,
        u.id AS user_id,
        u.name,
        u.first_name,
        u.last_name,
        u.avatar
      FROM product_reviews pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = ?
      ORDER BY pr.created_at DESC
    `,
    [productId]
  );

  const [summaryRows] = await pool.query(
    `
      SELECT
        COUNT(*) AS total_reviews,
        ROUND(AVG(rating), 1) AS average_rating
      FROM product_reviews
      WHERE product_id = ?
    `,
    [productId]
  );

  const [distributionRows] = await pool.query(
    `
      SELECT rating, COUNT(*) AS total
      FROM product_reviews
      WHERE product_id = ?
      GROUP BY rating
      ORDER BY rating DESC
    `,
    [productId]
  );

  const summary = summaryRows[0] || { total_reviews: 0, average_rating: null };
  const distributionMap = new Map(distributionRows.map((row) => [Number(row.rating), Number(row.total)]));

  return {
    reviews,
    review_summary: {
      total_reviews: Number(summary.total_reviews) || 0,
      average_rating: summary.average_rating === null ? null : Number(summary.average_rating),
      distribution: [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        total: distributionMap.get(rating) || 0,
      })),
    },
  };
};

// GET /api/products — public, no auth needed
exports.getPublicProducts = async (req, res) => {
  try {
    const { category, brand, sort, home } = req.query;
    const onlyHomeProducts = String(home).toLowerCase() === 'true';

    let query = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.group_name,
        p.details_json,
        p.is_active,
        p.show_on_home,
        p.home_display_order,
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

    if (onlyHomeProducts) {
      query += ` AND p.show_on_home = TRUE`;
    }

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (brand) {
      query += ` AND b.slug = ?`;
      params.push(brand);
    }

    // Sorting
    if (onlyHomeProducts) {
      query += `
        ORDER BY
          CASE WHEN p.home_display_order IS NULL THEN 1 ELSE 0 END,
          p.home_display_order ASC,
          p.created_at DESC
        LIMIT 4
      `;
    } else if (sort === 'newest') {
      query += ` ORDER BY p.created_at DESC`;
    } else if (sort === 'a-z') {
      query += ` ORDER BY p.name ASC`;
    } else {
      query += ` ORDER BY p.created_at DESC`;
    }

    const [products] = await pool.query(query, params);

    // Attach variants to each product
    for (const product of products) {
      product.details = parseProductDetails(product.details_json);
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

    let groupProducts = [];
    if (products[0].group_name) {
      const [groupRows] = await pool.query(`
        SELECT
          p.id,
          p.name,
          p.group_name,
          p.description,
          c.name       AS category_name,
          c.slug       AS category_slug,
          b.name       AS brand_name,
          b.slug       AS brand_slug,
          MAX(pi.image_url) AS primary_image,
          GROUP_CONCAT(pv.size ORDER BY pv.price ASC SEPARATOR ' · ') AS sizes
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b     ON p.brand_id = b.id
        LEFT JOIN product_images pi
          ON p.id = pi.product_id AND pi.is_primary = TRUE
        LEFT JOIN product_variants pv
          ON p.id = pv.product_id
        WHERE p.group_name = ? AND p.is_active = TRUE
        GROUP BY p.id, p.name, p.group_name, p.description, c.name, c.slug, b.name, b.slug
        ORDER BY c.name ASC
      `, [products[0].group_name]);
      groupProducts = groupRows;
    }

    const reviewData = await getProductReviewsData(id);

    res.status(200).json({
      ...products[0],
      details: parseProductDetails(products[0].details_json),
      images,
      variants,
      group_products: groupProducts,
      ...reviewData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicProductReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (!products.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviewData = await getProductReviewsData(id);
    res.status(200).json(reviewData);
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
