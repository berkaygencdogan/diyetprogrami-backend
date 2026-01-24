import { pool } from "../config/db.js";

// PUBLIC (home slider)
export const getSliders = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, image, link FROM sliders WHERE is_active = 1 ORDER BY id DESC",
    );
    res.set("Cache-Control", "no-store");
    res.json(rows);
  } catch (e) {
    next(e);
  }
};

// ADMIN
export const createSlider = async (req, res, next) => {
  try {
    const { title, image, link } = req.body;

    await pool.query(
      "INSERT INTO sliders (title, image, link) VALUES (?, ?, ?)",
      [title, image, link || null],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

export const deleteSlider = async (req, res, next) => {
  try {
    await pool.query("DELETE FROM sliders WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
