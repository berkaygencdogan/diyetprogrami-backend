import { pool } from "../config/db.js";

export const getCategories = async (req, res, next) => {
  try {
    res.set("Cache-Control", "no-store");

    const [rows] = await pool.query(
      `
      SELECT id, name, slug
      FROM categories
      WHERE parent_id IS NULL
      ORDER BY id
      `,
    );

    res.json(rows);
  } catch (e) {
    next(e);
  }
};
