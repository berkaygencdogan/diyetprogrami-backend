import { pool } from "../config/db.js";
import slugify from "slugify";

export const getTags = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, slug FROM tags ORDER BY name ASC`,
  );
  res.json(rows);
};

export const createTag = async (req, res) => {
  const { name } = req.body;

  const slug = slugify(name, { lower: true, strict: true, locale: "tr" });

  const [exists] = await pool.query(
    `SELECT id FROM tags WHERE slug = ? LIMIT 1`,
    [slug],
  );

  if (exists.length) {
    return res.json(exists[0]); // varsa onu döndür
  }

  const [result] = await pool.query(
    `INSERT INTO tags (name, slug) VALUES (?, ?)`,
    [name, slug],
  );

  res.json({ id: result.insertId, name, slug });
};
