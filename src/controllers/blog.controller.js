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

  // 1️⃣ BLOGU GETİR
  const [rows] = await pool.query(
    `
    SELECT 
      b.id,
      b.title,
      b.slug,
      b.content,
      b.cover_image,
      b.views,
      u.name AS author_name
    FROM blogs b
    JOIN users u ON u.id = b.author_id
    WHERE b.slug = ? AND b.status = 'published'
    LIMIT 1
    `,
    [slug],
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Blog bulunamadı" });
  }

  const blog = rows[0];

  // 2️⃣ OKUNMA SAYISINI ARTIR
  await pool.query(`UPDATE blogs SET views = views + 1 WHERE id = ?`, [
    blog.id,
  ]);

  // 3️⃣ RESPONSE
  return res.json({
    ...blog,
    views: blog.views + 1, // frontend doğru görsün diye
  });
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
    const { title, content, cover_image, category_id } = req.body;

    const slug = slugify(title, {
      lower: true,
      strict: true,
      locale: "tr",
    });

    await pool.query(
      `INSERT INTO blogs (title, slug, content, cover_image, category_id, author_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, slug, content, cover_image, category_id, req.user.id],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { title, content, cover_image, category_id } = req.body;

    await pool.query(
      `
      UPDATE blogs
      SET title = ?, content = ?, cover_image = ?, category_id = ?
      WHERE id = ?
      `,
      [title, content, cover_image, category_id, req.params.id],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const getBlogByIdAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT id, title, content, cover_image, category_id
      FROM blogs
      WHERE id = ? LIMIT 1
      `,
      [req.params.id],
    );

    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
};

export const getBlogsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        b.id,
        b.title,
        b.slug,
        b.cover_image,
        b.created_at,
        c.name AS category_name,
        c.slug AS category_slug,
        parent.name AS parent_name,
        parent.slug AS parent_slug
      FROM blogs b
      JOIN categories c ON c.id = b.category_id
      LEFT JOIN categories parent ON parent.id = c.parent_id
      WHERE 
        (
          c.slug = ?              -- direkt kategori (beslenme, saglikli-yasam)
          OR parent.slug = ?       -- alt kategori (diyet)
        )
        AND b.status = 'published'
      ORDER BY b.created_at DESC
      `,
      [slug, slug],
    );

    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const getLatestBlogs = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        b.id,
        b.title,
        b.slug,
        b.cover_image,
        b.created_at,
        c.name AS category_name,
        parent.name AS parent_name
      FROM blogs b
      JOIN categories c ON c.id = b.category_id
      LEFT JOIN categories parent ON parent.id = c.parent_id
      WHERE b.status = 'published'
      ORDER BY b.created_at DESC
      LIMIT 10
      `,
    );

    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const searchBlogs = async (req, res, next) => {
  try {
    const q = req.query.q?.trim();

    if (!q || q.length < 2) {
      return res.json([]);
    }

    const [rows] = await pool.query(
      `
      SELECT id, title, slug, cover_image, created_at
      FROM blogs
      WHERE status = 'published'
      AND (
        title LIKE ? OR
        content LIKE ?
      )
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [`%${q}%`, `%${q}%`],
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const incrementBlogViews = async (req, res, next) => {
  try {
    await pool.query("UPDATE blogs SET views = views + 1 WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const getPopularBlogs = async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT id, title, slug, cover_image, views
    FROM blogs
    WHERE status = 'published'
    ORDER BY views DESC
    LIMIT 5
    `,
  );
  res.json(rows);
};

export const getRecommendedBlogs = async (req, res) => {
  const { goal } = req.query;

  const [rows] = await pool.query(
    `
    SELECT DISTINCT b.id, b.title, b.slug, b.cover_image, b.views
    FROM blogs b
    JOIN blog_tags bt ON bt.blog_id = b.id
    JOIN tags t ON t.id = bt.tag_id
    WHERE t.slug = ?
      AND b.status = 'published'
    ORDER BY b.views DESC
    LIMIT 5
    `,
    [goal],
  );

  res.json(rows);
};
