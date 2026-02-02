// controllers/reaction.controller.js
import { pool } from "../config/db.js";

export const getReactionsByBlog = async (req, res) => {
  const { blogId } = req.params;

  const [rows] = await pool.query(
    `
    SELECT emoji, COUNT(*) as count
    FROM blog_reactions
    WHERE blog_id = ?
    GROUP BY emoji
    `,
    [blogId],
  );

  res.json(rows);
};

export const toggleReaction = async (req, res) => {
  const { blogId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;

  const [[existing]] = await pool.query(
    `SELECT id, emoji FROM blog_reactions WHERE blog_id=? AND user_id=?`,
    [blogId, userId],
  );

  if (existing) {
    if (existing.emoji === emoji) {
      await pool.query(`DELETE FROM blog_reactions WHERE id=?`, [existing.id]);
      return res.json({ reacted: false });
    }

    await pool.query(`UPDATE blog_reactions SET emoji=? WHERE id=?`, [
      emoji,
      existing.id,
    ]);
    return res.json({ reacted: true });
  }

  await pool.query(
    `INSERT INTO blog_reactions (blog_id, user_id, emoji)
     VALUES (?, ?, ?)`,
    [blogId, userId, emoji],
  );

  res.json({ reacted: true });
};
