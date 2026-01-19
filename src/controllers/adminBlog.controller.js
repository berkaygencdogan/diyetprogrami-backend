import { pool } from "../config/db.js";

export const getAdminBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, title, slug, cover_image, content FROM blogs WHERE id = ? LIMIT 1",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Blog bulunamadı" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET ADMIN BLOG ERROR:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const updateAdminBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, cover_image, content } = req.body;

    await pool.query(
      `
      UPDATE blogs
      SET title = ?, cover_image = ?, content = ?
      WHERE id = ?
      `,
      [title, cover_image, content, id],
    );

    res.json({ success: true });
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
