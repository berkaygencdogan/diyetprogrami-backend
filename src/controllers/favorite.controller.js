import { pool } from "../config/db.js";

export const toggleFavorite = async (req, res) => {
  const { blogId } = req.params;
  const guestId = req.query.guest_id;
  const userId = req.user?.id || null;

  if (!userId && !guestId) {
    return res.status(400).json({ error: "Yetkisiz" });
  }

  const [exists] = await pool.query(
    `
    SELECT id FROM favorite_blogs
    WHERE blog_id = ?
    AND (
      (user_id IS NOT NULL AND user_id = ?)
      OR
      (guest_id IS NOT NULL AND guest_id = ?)
    )
    `,
    [blogId, userId, guestId],
  );

  if (exists.length) {
    await pool.query(
      `
      DELETE FROM favorite_blogs
      WHERE blog_id = ?
      AND (
        (user_id IS NOT NULL AND user_id = ?)
        OR
        (guest_id IS NOT NULL AND guest_id = ?)
      )
      `,
      [blogId, userId, guestId],
    );

    return res.json({ favorited: false });
  }

  await pool.query(
    `
    INSERT INTO favorite_blogs (user_id, guest_id, blog_id)
    VALUES (?, ?, ?)
    `,
    [userId, userId ? null : guestId, blogId],
  );

  res.json({ favorited: true });
};

export const checkFavorite = async (req, res) => {
  const { blogId } = req.params;
  const guestId = req.query.guest_id;
  const userId = req.user?.id || null;

  const [rows] = await pool.query(
    `
    SELECT 1 FROM favorite_blogs
    WHERE blog_id = ?
    AND (
      (user_id IS NOT NULL AND user_id = ?)
      OR
      (guest_id IS NOT NULL AND guest_id = ?)
    )
    LIMIT 1
    `,
    [blogId, userId, guestId],
  );

  res.json({ isFavorite: rows.length > 0 });
};

export const getFavorites = async (req, res) => {
  const guestId = req.query.guest_id;
  const userId = req.user?.id || null;

  if (!userId && !guestId) return res.json([]);

  const [rows] = await pool.query(
    `
    SELECT b.id, b.title, b.slug, b.cover_image
    FROM favorite_blogs f
    JOIN blogs b ON b.id = f.blog_id
    WHERE
      (f.user_id IS NOT NULL AND f.user_id = ?)
      OR
      (f.guest_id IS NOT NULL AND f.guest_id = ?)
    ORDER BY f.created_at DESC
    `,
    [userId, guestId],
  );

  res.json(rows);
};

// controller
export const attachGuestFavorites = async (req, res) => {
  const { guest_id } = req.body;

  await pool.query(
    `
    UPDATE favorite_blogs
    SET user_id = ?, guest_id = NULL
    WHERE guest_id = ?
    `,
    [req.user.id, guest_id],
  );

  res.json({ success: true });
};
