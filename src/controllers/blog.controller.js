import { pool } from "../config/db.js";
import slugify from "slugify";

// Public
export const getBlogs = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, slug, content, cover_image, created_at
       FROM blogs
       ORDER BY created_at DESC`,
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;

  const [rows] = await pool.query(
    "SELECT * FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1",
    [slug],
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Blog bulunamadı" });
  }

  return res.json(rows[0]);
};

// Admin
export const getBlogsAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, slug, created_at
       FROM blogs
       ORDER BY created_at DESC`,
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, content, cover_image } = req.body;

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "tr",
    });

    await pool.query(
      `INSERT INTO blogs (title, slug, content, cover_image, author_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, slug, content, cover_image, req.user.id],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { title, content, cover_image } = req.body;

    await pool.query(
      `UPDATE blogs
       SET title = ?, content = ?, cover_image = ?
       WHERE id = ?`,
      [title, content, cover_image, req.params.id],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

// Admin - ID ile tek blog
export const getBlogByIdAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, content, cover_image
       FROM blogs
       WHERE id = ? LIMIT 1`,
      [req.params.id],
    );
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
};
