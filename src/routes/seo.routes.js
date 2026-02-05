import express from "express";
import { renderSeo } from "../controllers/seo.controller.js";
import { pool } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id,
         page_key,
         title,
         description,
         canonical
       FROM seo_settings
       WHERE status = 1
       ORDER BY page_key`,
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SEO listesi alınamadı" });
  }
});

router.get("/render", renderSeo);

router.post("/", async (req, res) => {
  try {
    const { page_key, title, description, canonical } = req.body;

    if (!page_key) {
      return res.status(400).json({ error: "page_key zorunlu" });
    }

    await pool.query(
      `
      UPDATE seo_settings
      SET
        title = ?,
        description = ?,
        canonical = ?
      WHERE page_key = ?
      LIMIT 1
      `,
      [title, description, canonical, page_key],
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SEO güncellenemedi" });
  }
});

export default router;
