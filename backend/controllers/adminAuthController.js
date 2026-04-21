const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const saveImage = require('../config/saveImage');
const { clearAuthCookie, setAuthCookie } = require('../utils/authCookies');
const {
  parseProductDetails,
  stringifyProductDetails,
} = require('../utils/productDetails');

const slugifyGroup = (value) => {
  if (!value) return null;
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is undefined!');
            return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
        }

        const [rows] = await pool.query(
            `SELECT * FROM admins WHERE email = ?`,
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const admin = rows[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const Admintoken = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                isAdmin: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        setAuthCookie(res, Admintoken, 'admin');

        res.status(200).json({
            message: 'Login successful',
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: 'Server Error'
        });
    }
};

exports.getAdminMe = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email FROM admins WHERE id = ?`,
      [req.admin.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({ admin: rows[0] });
  } catch (err) {
    console.error('Admin session error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.logout = async (req, res) => {
  clearAuthCookie(res, 'admin');
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.createCategory = async(req,res) => {
    try{
        const {name,slug} = req.body;

        const [existing] = await pool.query(
            `SELECT * FROM categories WHERE slug = ?`,
            [slug]
        );

        if(existing.length > 0){
            return res.status(400).json({message:'Category Already Exists'});
        }
        const newCategory = await pool.query(
            `INSERT INTO categories(id,name,slug) VALUES (UUID(),?,?)`,
            [name,slug]
        );
        res.status(201).json({message:'Category Addeed Succesfully'});
    }
    catch(err){
        res.status(500).json({message:'Server Error'});
    }
}
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.*,
        COUNT(DISTINCT p.id) AS product_count,
        COUNT(DISTINCT b.id) AS brand_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN brands b   ON b.category_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id }        = req.params;
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    // Check slug not taken by another category
    const [existing] = await pool.query(
      `SELECT id FROM categories WHERE slug = ? AND id != ?`,
      [slug, id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    await pool.query(
      `UPDATE categories SET name = ?, slug = ? WHERE id = ?`,
      [name, slug, id]
    );

    res.status(200).json({ message: 'Category updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check category exists first
    const [existing] = await pool.query(
      `SELECT id FROM categories WHERE id = ?`, [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await pool.query(
      `DELETE FROM categories WHERE id = ?`, [id]
    );

    res.status(200).json({ message: 'Category deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};


// GET /api/admin/brands
exports.getBrands = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.*,
        c.name       AS category_name,
        COUNT(p.id)  AS product_count
      FROM brands b
      LEFT JOIN categories c ON b.category_id = c.id
      LEFT JOIN products p   ON p.brand_id = b.id
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/brands
exports.addBrand = async (req, res) => {
  try {
    const { name, slug, category_id } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    if (!category_id) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Check slug unique
    const [existing] = await pool.query(
      `SELECT id FROM brands WHERE slug = ?`, [slug]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    await pool.query(
      `INSERT INTO brands (id, name, slug, category_id) VALUES (UUID(), ?, ?, ?)`,
      [name, slug, category_id]
    );

    res.status(201).json({ message: 'Brand added successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/brands/:id
exports.updateBrand = async (req, res) => {
  try {
    const { id }                    = req.params;
    const { name, slug, category_id } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Name and slug are required' });
    }

    if (!category_id) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Check slug unique excluding current
    const [existing] = await pool.query(
      `SELECT id FROM brands WHERE slug = ? AND id != ?`, [slug, id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    await pool.query(
      `UPDATE brands SET name = ?, slug = ?, category_id = ? WHERE id = ?`,
      [name, slug, category_id, id]
    );

    res.status(200).json({ message: 'Brand updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/admin/brands/:id
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      `SELECT id FROM brands WHERE id = ?`, [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    // Unlink products before deleting
    await pool.query(
      `UPDATE products SET brand_id = NULL WHERE brand_id = ?`, [id]
    );

    await pool.query(`DELETE FROM brands WHERE id = ?`, [id]);

    res.status(200).json({ message: 'Brand deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


//Products 

exports.addProduct = async (req, res) => {
  try {
    const { name, description, category_id, brand_id, variants, group_name, details_json } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    if (req.files.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 images allowed' });
    }

    // Parse variants
    const parsedVariants = JSON.parse(variants || '[]');
    if (parsedVariants.length === 0) {
      return res.status(400).json({ message: 'At least one variant is required' });
    }

    // Validate each variant
    for (const v of parsedVariants) {
      if (!v.size || !v.price) {
        return res.status(400).json({ message: 'Each variant needs size and price' });
      }
      if (isNaN(v.price) || Number(v.price) <= 0) {
        return res.status(400).json({ message: `Invalid price for ${v.size}` });
      }
      if (v.discount_price && Number(v.discount_price) >= Number(v.price)) {
        return res.status(400).json({ message: `Discount price must be less than price for ${v.size}` });
      }
    }

    // Insert product
    const productId = require('crypto').randomUUID();
    const finalGroupName = group_name ? group_name.trim() : slugifyGroup(name);
    const productDetails = stringifyProductDetails(parseProductDetails(details_json));
    await pool.query(
      `INSERT INTO products (id, name, description, category_id, brand_id, group_name, details_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [productId, name, description || null, category_id || null, brand_id || null, finalGroupName || null, productDetails]
    );

    // Insert variants
    for (const v of parsedVariants) {
      await pool.query(
        `INSERT INTO product_variants (id, product_id, size, price, discount_price)
         VALUES (UUID(), ?, ?, ?, ?)`,
        [productId, v.size, v.price, v.discount_price || null]
      );
    }

    // Save images
    for (let i = 0; i < req.files.length; i++) {
      const imageUrl  = await saveImage(req.files[i].buffer);
      const isPrimary = i === 0;
      await pool.query(
        `INSERT INTO product_images (id, product_id, image_url, is_primary)
         VALUES (UUID(), ?, ?, ?)`,
        [productId, imageUrl, isPrimary]
      );
    }

    res.status(201).json({ message: 'Product added successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.group_name,
        p.details_json,
        p.is_active,
        p.created_at,
        c.name       AS category_name,
        b.name AS brand_name,
        pi.image_url AS primary_image
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      LEFT JOIN brands b 
        ON p.brand_id = b.id
      LEFT JOIN product_images pi
        ON p.id = pi.product_id AND pi.is_primary = TRUE
      ORDER BY p.created_at DESC
    `);

    // Get starting price for each product (lowest variant price)
    for (const product of products) {
      product.details = parseProductDetails(product.details_json);
      const [variants] = await pool.query(
        `SELECT size, price, discount_price
         FROM product_variants
         WHERE product_id = ?
         ORDER BY price ASC`,
        [product.id]
      );
      product.variants = variants;
      product.starting_price = variants.length > 0 ? variants[0].price : null;
    }

    res.status(200).json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [images] = await pool.query(
      `SELECT * FROM product_images WHERE product_id = ?`, [id]
    );

    const [variants] = await pool.query(
      `SELECT * FROM product_variants WHERE product_id = ? ORDER BY price ASC`, [id]
    );

    res.status(200).json({
      ...products[0],
      details: parseProductDetails(products[0].details_json),
      images,
      variants,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, brand_id, variants, remove_images, group_name, details_json } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Check exists
    const [existing] = await pool.query(
      `SELECT id FROM products WHERE id = ?`, [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product
    const finalGroupName = group_name ? group_name.trim() : slugifyGroup(name);
    const productDetails = stringifyProductDetails(parseProductDetails(details_json));
    await pool.query(`
      UPDATE products
      SET name = ?, description = ?, category_id = ?, brand_id = ?, group_name = ?, details_json = ?
      WHERE id = ?
    `, [name, description || null, category_id || null, brand_id || null, finalGroupName || null, productDetails, id]);

    // Replace variants — delete old ones and insert new
    if (variants) {
      const parsedVariants = JSON.parse(variants);

      if (parsedVariants.length === 0) {
        return res.status(400).json({ message: 'At least one variant is required' });
      }

      // Validate
      for (const v of parsedVariants) {
        if (!v.size || !v.price) {
          return res.status(400).json({ message: 'Each variant needs size and price' });
        }
        if (v.discount_price && Number(v.discount_price) >= Number(v.price)) {
          return res.status(400).json({ message: `Discount price must be less than price for ${v.size}` });
        }
      }

      // Delete old variants
      await pool.query(
        `DELETE FROM product_variants WHERE product_id = ?`, [id]
      );

      // Insert new variants
      for (const v of parsedVariants) {
        await pool.query(
          `INSERT INTO product_variants (id, product_id, size, price, discount_price)
           VALUES (UUID(), ?, ?, ?, ?)`,
          [id, v.size, v.price, v.discount_price || null]
        );
      }
    }

    // Remove images if requested
    if (remove_images) {
      const removeIds = JSON.parse(remove_images);
      if (removeIds.length > 0) {
        const [toDelete] = await pool.query(
          `SELECT image_url FROM product_images WHERE id IN (?)`,
          [removeIds]
        );
        await pool.query(
          `DELETE FROM product_images WHERE id IN (?)`,
          [removeIds]
        );
        const fs   = require('fs');
        const path = require('path');
        toDelete.forEach(img => {
          const filepath = path.join(process.cwd(), img.image_url);
          if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        });
      }
    }

    // Add new images
    if (req.files && req.files.length > 0) {
      const [currentImages] = await pool.query(
        `SELECT COUNT(*) AS count FROM product_images WHERE product_id = ?`, [id]
      );
      if (currentImages[0].count + req.files.length > 3) {
        return res.status(400).json({ message: 'Maximum 3 images allowed' });
      }

      const [primaryCheck] = await pool.query(
        `SELECT id FROM product_images WHERE product_id = ? AND is_primary = TRUE`, [id]
      );

      for (let i = 0; i < req.files.length; i++) {
        const imageUrl  = await saveImage(req.files[i].buffer);
        const isPrimary = primaryCheck.length === 0 && i === 0;
        await pool.query(
          `INSERT INTO product_images (id, product_id, image_url, is_primary)
           VALUES (UUID(), ?, ?, ?)`,
          [id, imageUrl, isPrimary]
        );
      }
    }

    res.status(200).json({ message: 'Product updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check product exists
    const [existing] = await pool.query(
      `SELECT id FROM products WHERE id = ?`, [id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get all images before deleting — so we can remove files from disk
    const [images] = await pool.query(
      `SELECT image_url FROM product_images WHERE product_id = ?`, [id]
    );

    // Delete images from DB first (CASCADE handles this but being explicit)
    await pool.query(
      `DELETE FROM product_images WHERE product_id = ?`, [id]
    );

    // Delete product from DB
    await pool.query(
      `DELETE FROM products WHERE id = ?`, [id]
    );

    // Delete image files from disk
    const fs   = require('fs');
    const path = require('path');
    images.forEach(img => {
      const filepath = path.join(process.cwd(), img.image_url);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });

    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
