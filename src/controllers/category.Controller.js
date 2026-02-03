import { pool } from "../config/db.js";

/* ======================
   GET CATEGORIES
====================== */
export const getCategories = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, slug, color
      FROM categories
      WHERE parent_id IS NULL
      ORDER BY id
    `);

    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, color } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Name ve slug zorunlu" });
    }

    await pool.query(
      `
      INSERT INTO categories (name, slug, color)
      VALUES (?, ?, ?)
      `,
      [name, slug, color || "#10b981"],
    );

    res.status(201).json({ message: "Kategori eklendi" });
  } catch (e) {
    next(e);
  }
};

/* ======================
   UPDATE CATEGORY
====================== */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, color } = req.body;

    await pool.query(
      `
      UPDATE categories
      SET name = ?, slug = ?, color = ?
      WHERE id = ?
      `,
      [name, slug, color, id],
    );

    res.json({ message: "Kategori güncellendi" });
  } catch (e) {
    next(e);
  }
};

/* ======================
   DELETE CATEGORY
====================== */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query(`DELETE FROM categories WHERE id = ?`, [id]);

    res.json({ message: "Kategori silindi" });
  } catch (e) {
    next(e);
  }
};
