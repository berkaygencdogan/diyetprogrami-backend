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

export const createComment = async (req, res) => {
  const { blog_id, parent_id, name, email, content } = req.body;

  if (!content || !email) {
    return res.status(400).json({ error: "Yorum boş olamaz" });
  }

  await pool.query(
    `
    INSERT INTO comments 
    (blog_id, parent_id, name, email, content, status, home)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [blog_id, parent_id || null, name || null, email, content, "pending", 0],
  );

  res.json({
    success: true,
    message: "Yorumunuz gönderildi. Onay sonrası yayınlanacaktır.",
  });
};

export const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        c.id,
        c.blog_id,
        c.parent_id,
        c.name,
        c.email,
        c.content,
        c.status,
        c.home,
        c.created_at,
        b.title AS blog_title
      FROM comments c
      LEFT JOIN blogs b ON b.id = c.blog_id
      ORDER BY 
        (c.status = 'pending') DESC,  -- 🔥 pending en üste
        c.created_at DESC
      `,
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const updateCommentAdmin = async (req, res) => {
  const { id } = req.params;
  const { status, home } = req.body;

  await pool.query(
    `
    UPDATE comments
    SET
      status = COALESCE(?, status),
      home = COALESCE(?, home)
    WHERE id = ?
    `,
    [status, home, id],
  );

  res.json({ success: true });
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

// ADMIN – home toggle
export const toggleHomeComment = async (req, res, next) => {
  try {
    await pool.query("UPDATE comments SET home = ? WHERE id = ?", [
      req.body.home,
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const getHomeComments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        c.id            AS comment_id,
        c.name          AS comment_name,
        c.content       AS comment_content,
        c.created_at    AS comment_created_at,

        b.id            AS blog_id,
        b.title,
        b.slug,
        b.cover_image,
        b.views,

        (
          SELECT COUNT(*)
          FROM comments c2
          WHERE c2.blog_id = b.id
            AND c2.status = 'approved'
        ) AS comment_count,

        GROUP_CONCAT(t.name SEPARATOR ',') AS tags

      FROM comments c
      JOIN blogs b ON b.id = c.blog_id
      LEFT JOIN blog_tags bt ON bt.blog_id = b.id
      LEFT JOIN tags t ON t.id = bt.tag_id

      WHERE c.home = 1
        AND c.status = 'approved'
        AND b.status = 'published'

      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 6
    `);

    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (e) {
    next(e);
  }
};
