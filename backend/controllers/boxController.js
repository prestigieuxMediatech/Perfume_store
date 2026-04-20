const pool = require('../config/db');

const parseIds = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalize = (value) => (typeof value === 'string' ? value.trim() : value);

// Admin: GET /api/admin/boxes
exports.getBoxes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.id,
        b.name,
        b.description,
        b.price,
        b.items_count,
        b.is_active,
        b.created_at,
        GROUP_CONCAT(c.id ORDER BY c.name SEPARATOR ',') AS category_ids,
        GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') AS category_names
      FROM boxes b
      LEFT JOIN box_allowed_categories bac ON bac.box_id = b.id
      LEFT JOIN categories c ON bac.category_id = c.id
      GROUP BY b.id, b.name, b.description, b.price, b.items_count, b.is_active, b.created_at
      ORDER BY b.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: POST /api/admin/boxes
exports.addBox = async (req, res) => {
  try {
    const { name, description, price, items_count, is_active, category_ids } = req.body;
    if (!name) return res.status(400).json({ message: 'Box name is required' });
    if (!price || Number(price) <= 0) return res.status(400).json({ message: 'Box price is required' });
    if (!items_count || Number(items_count) <= 0) return res.status(400).json({ message: 'Items per box is required' });

    const categoryIds = parseIds(category_ids);
    if (categoryIds.length === 0) {
      return res.status(400).json({ message: 'Select at least one category' });
    }

    const boxId = require('crypto').randomUUID();
    await pool.query(
      `INSERT INTO boxes (id, name, description, price, items_count, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        boxId,
        normalize(name),
        normalize(description) || null,
        Number(price),
        Number(items_count),
        is_active === 'false' ? false : true
      ]
    );

    for (const catId of categoryIds) {
      await pool.query(
        `INSERT INTO box_allowed_categories (id, box_id, category_id)
         VALUES (UUID(), ?, ?)`,
        [boxId, catId]
      );
    }

    res.status(201).json({ message: 'Box created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: GET /api/admin/boxes/:id
exports.getBoxById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM boxes WHERE id = ?`, [id]);
    if (!rows.length) return res.status(404).json({ message: 'Box not found' });

    const [categories] = await pool.query(`
      SELECT c.id, c.name
      FROM box_allowed_categories bac
      JOIN categories c ON bac.category_id = c.id
      WHERE bac.box_id = ?
      ORDER BY c.name ASC
    `, [id]);

    res.status(200).json({ ...rows[0], categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: PUT /api/admin/boxes/:id
exports.updateBox = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, items_count, is_active, category_ids } = req.body;
    if (!name) return res.status(400).json({ message: 'Box name is required' });
    if (!price || Number(price) <= 0) return res.status(400).json({ message: 'Box price is required' });
    if (!items_count || Number(items_count) <= 0) return res.status(400).json({ message: 'Items per box is required' });

    const [existing] = await pool.query(`SELECT id FROM boxes WHERE id = ?`, [id]);
    if (!existing.length) return res.status(404).json({ message: 'Box not found' });

    const categoryIds = parseIds(category_ids);
    if (categoryIds.length === 0) {
      return res.status(400).json({ message: 'Select at least one category' });
    }

    await pool.query(
      `UPDATE boxes
       SET name = ?, description = ?, price = ?, items_count = ?, is_active = ?
       WHERE id = ?`,
      [
        normalize(name),
        normalize(description) || null,
        Number(price),
        Number(items_count),
        is_active === 'false' ? false : true,
        id
      ]
    );

    await pool.query(`DELETE FROM box_allowed_categories WHERE box_id = ?`, [id]);
    for (const catId of categoryIds) {
      await pool.query(
        `INSERT INTO box_allowed_categories (id, box_id, category_id)
         VALUES (UUID(), ?, ?)`,
        [id, catId]
      );
    }

    res.status(200).json({ message: 'Box updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: DELETE /api/admin/boxes/:id
exports.deleteBox = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query(`SELECT id FROM boxes WHERE id = ?`, [id]);
    if (!existing.length) return res.status(404).json({ message: 'Box not found' });

    await pool.query(`DELETE FROM box_allowed_categories WHERE box_id = ?`, [id]);
    await pool.query(`DELETE FROM boxes WHERE id = ?`, [id]);

    res.status(200).json({ message: 'Box deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public: GET /api/boxes
exports.getPublicBoxes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.id,
        b.name,
        b.description,
        b.price,
        b.items_count,
        b.is_active,
        b.created_at,
        GROUP_CONCAT(c.id ORDER BY c.name SEPARATOR ',') AS category_ids,
        GROUP_CONCAT(c.slug ORDER BY c.name SEPARATOR ',') AS category_slugs,
        GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ', ') AS category_names
      FROM boxes b
      LEFT JOIN box_allowed_categories bac ON bac.box_id = b.id
      LEFT JOIN categories c ON bac.category_id = c.id
      WHERE b.is_active = TRUE
      GROUP BY b.id, b.name, b.description, b.price, b.items_count, b.is_active, b.created_at
      ORDER BY b.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
