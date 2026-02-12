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

export const getBlogsByTag = async (req, res) => {
  const { slug } = req.params;

  const [rows] = await pool.query(
    `
    SELECT b.*
    FROM blogs b
    JOIN blog_tags bt ON bt.blog_id = b.id
    JOIN tags t ON t.id = bt.tag_id
    WHERE t.slug = ?
    ORDER BY b.created_at DESC
    `,
    [slug],
  );

  res.json(rows);
};

export const getTagBySlug = async (req, res) => {
  const { slug } = req.params;

  const [rows] = await pool.query(
    `SELECT id, name, slug FROM tags WHERE slug = ? LIMIT 1`,
    [slug],
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Tag bulunamadı" });
  }

  res.json(rows[0]);
};
