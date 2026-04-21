const pool = require('../config/db');
const saveImage = require('../config/saveImage');

const slugify = (value) => {
  if (!value) return '';
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const normalize = (value) => (typeof value === 'string' ? value.trim() : value);

const formatBlog = (row) => ({
  ...row,
  is_published: Boolean(row.is_published),
});

exports.getAdminBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        slug,
        category_label,
        excerpt,
        cover_image,
        author_name,
        read_time_minutes,
        is_published,
        published_at,
        created_at,
        updated_at
      FROM blogs
      ORDER BY COALESCE(published_at, created_at) DESC, created_at DESC
    `);

    res.status(200).json(rows.map(formatBlog));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(formatBlog(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const title = normalize(req.body.title);
    const excerpt = normalize(req.body.excerpt);
    const content = normalize(req.body.content);
    const authorName = normalize(req.body.author_name) || '7EVEN Editorial';
    const categoryLabel = normalize(req.body.category_label) || 'Journal';
    const readTimeMinutes = Number(req.body.read_time_minutes) || 4;
    const isPublished = String(req.body.is_published) === 'true';
    const slug = slugify(req.body.slug || title);

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!slug) return res.status(400).json({ message: 'Slug is required' });
    if (!excerpt) return res.status(400).json({ message: 'Excerpt is required' });
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const [existing] = await pool.query('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (existing.length) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    let coverImage = normalize(req.body.existing_cover_image) || null;
    if (req.file) {
      coverImage = await saveImage(req.file.buffer, {
        folder: 'blogs',
        width: 1600,
        height: 1100,
        fit: 'cover',
        quality: 84,
      });
    }

    await pool.query(
      `
        INSERT INTO blogs (
          id,
          title,
          slug,
          category_label,
          excerpt,
          content,
          cover_image,
          author_name,
          read_time_minutes,
          is_published,
          published_at
        )
        VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        slug,
        categoryLabel,
        excerpt,
        content,
        coverImage,
        authorName,
        readTimeMinutes,
        isPublished,
        isPublished ? new Date() : null,
      ]
    );

    res.status(201).json({ message: 'Blog created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const current = rows[0];
    const title = normalize(req.body.title);
    const excerpt = normalize(req.body.excerpt);
    const content = normalize(req.body.content);
    const authorName = normalize(req.body.author_name) || '7EVEN Editorial';
    const categoryLabel = normalize(req.body.category_label) || 'Journal';
    const readTimeMinutes = Number(req.body.read_time_minutes) || 4;
    const isPublished = String(req.body.is_published) === 'true';
    const slug = slugify(req.body.slug || title);

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (!slug) return res.status(400).json({ message: 'Slug is required' });
    if (!excerpt) return res.status(400).json({ message: 'Excerpt is required' });
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const [existing] = await pool.query(
      'SELECT id FROM blogs WHERE slug = ? AND id != ?',
      [slug, id]
    );
    if (existing.length) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    let coverImage = normalize(req.body.existing_cover_image) || current.cover_image || null;
    if (req.file) {
      coverImage = await saveImage(req.file.buffer, {
        folder: 'blogs',
        width: 1600,
        height: 1100,
        fit: 'cover',
        quality: 84,
      });
    }

    const shouldSetPublishedAt = isPublished && !current.published_at;

    await pool.query(
      `
        UPDATE blogs
        SET
          title = ?,
          slug = ?,
          category_label = ?,
          excerpt = ?,
          content = ?,
          cover_image = ?,
          author_name = ?,
          read_time_minutes = ?,
          is_published = ?,
          published_at = ?
        WHERE id = ?
      `,
      [
        title,
        slug,
        categoryLabel,
        excerpt,
        content,
        coverImage,
        authorName,
        readTimeMinutes,
        isPublished,
        isPublished ? (shouldSetPublishedAt ? new Date() : current.published_at) : null,
        id,
      ]
    );

    res.status(200).json({ message: 'Blog updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT id FROM blogs WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicBlogs = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        slug,
        category_label,
        excerpt,
        cover_image,
        author_name,
        read_time_minutes,
        published_at,
        created_at
      FROM blogs
      WHERE is_published = TRUE
      ORDER BY published_at DESC, created_at DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPublicBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `
        SELECT
          id,
          title,
          slug,
          category_label,
          excerpt,
          content,
          cover_image,
          author_name,
          read_time_minutes,
          published_at,
          created_at
        FROM blogs
        WHERE slug = ? AND is_published = TRUE
        LIMIT 1
      `,
      [slug]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const [related] = await pool.query(
      `
        SELECT
          id,
          title,
          slug,
          category_label,
          excerpt,
          cover_image,
          author_name,
          read_time_minutes,
          published_at
        FROM blogs
        WHERE is_published = TRUE AND slug != ?
        ORDER BY published_at DESC
        LIMIT 3
      `,
      [slug]
    );

    res.status(200).json({
      ...rows[0],
      related,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
