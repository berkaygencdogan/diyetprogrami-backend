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

  const userId = req.user?.id || null;
  const guestId = req.query.guest_id || null;

  if (!userId && !guestId) {
    return res.status(400).json({ error: "Yetkisiz" });
  }

  const [[existing]] = await pool.query(
    `
    SELECT id, emoji
    FROM blog_reactions
    WHERE blog_id = ?
    AND (
      (user_id IS NOT NULL AND user_id = ?)
      OR
      (guest_id IS NOT NULL AND guest_id = ?)
    )
    `,
    [blogId, userId, guestId],
  );

  // varsa
  if (existing) {
    if (existing.emoji === emoji) {
      await pool.query(`DELETE FROM blog_reactions WHERE id = ?`, [
        existing.id,
      ]);
      return res.json({ reacted: false });
    }

    await pool.query(`UPDATE blog_reactions SET emoji = ? WHERE id = ?`, [
      emoji,
      existing.id,
    ]);
    return res.json({ reacted: true });
  }

  // yoksa
  await pool.query(
    `
    INSERT INTO blog_reactions (blog_id, user_id, guest_id, emoji)
    VALUES (?, ?, ?, ?)
    `,
    [blogId, userId, userId ? null : guestId, emoji],
  );

  res.json({ reacted: true });
};

// controller
export const attachGuestReactions = async (req, res) => {
  const { guest_id } = req.body;

  await pool.query(
    `
    UPDATE blog_reactions
    SET user_id = ?, guest_id = NULL
    WHERE guest_id = ?
    `,
    [req.user.id, guest_id],
  );

  res.json({ success: true });
};
