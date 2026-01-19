import { pool } from "../config/db.js";

// Public: sadece onaylılar
export const getApprovedComments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT id, name, content, created_at, parent_id
      FROM comments
      WHERE blog_id = ? AND status = 'approved'
      ORDER BY created_at ASC
      `,
      [req.params.blogId],
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

// Public: yorum ekle (always pending)
export const createComment = async (req, res) => {
  const { blog_id, parent_id, name, email, content } = req.body;

  await pool.query(
    `
    INSERT INTO comments (blog_id, parent_id, name, email, content)
    VALUES (?, ?, ?, ?, ?)
    `,
    [blog_id, parent_id || null, name, email, content],
  );

  res.json({ success: true });
};

// Admin: tüm yorumlar
export const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT c.*, b.title AS blog_title
      FROM comments c
      JOIN blogs b ON b.id = c.blog_id
      WHERE c.status = 'pending'
      ORDER BY c.created_at DESC
      `,
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const updateCommentAdmin = async (req, res, next) => {
  try {
    const { status, content } = req.body;

    await pool.query(
      `UPDATE comments SET status = ?, content = ? WHERE id = ?`,
      [status, content, req.params.id],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;

  const [rows] = await pool.query(
    `
    SELECT * FROM comments
    WHERE blog_id = ? AND status = 'approved'
    ORDER BY created_at ASC
    `,
    [blogId],
  );

  res.json(rows);
};
