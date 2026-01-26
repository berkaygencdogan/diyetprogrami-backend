import { pool } from "../config/db.js";

export const toggleFavorite = async (req, res) => {
  const { blogId } = req.params;

  const [exists] = await pool.query(
    `SELECT id FROM favorite_blogs WHERE user_id = ? AND blog_id = ?`,
    [req.user.id, blogId],
  );

  if (exists.length) {
    await pool.query(
      `DELETE FROM favorite_blogs WHERE user_id = ? AND blog_id = ?`,
      [req.user.id, blogId],
    );
    return res.json({ favorited: false });
  }

  await pool.query(
    `INSERT INTO favorite_blogs (user_id, blog_id) VALUES (?, ?)`,
    [req.user.id, blogId],
  );

  res.json({ favorited: true });
};

export const getFavorites = async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT b.id, b.title, b.slug, b.cover_image
    FROM favorite_blogs f
    JOIN blogs b ON b.id = f.blog_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
    `,
    [req.user.id],
  );

  res.json(rows);
};

export const checkFavorite = async (req, res) => {
  const userId = req.user.id;
  const { blogId } = req.params;

  const [rows] = await pool.query(
    `
    SELECT 1 
    FROM favorite_blogs
    WHERE user_id = ? AND blog_id = ?
    LIMIT 1
    `,
    [userId, blogId],
  );

  res.json({ isFavorite: rows.length > 0 });
};
