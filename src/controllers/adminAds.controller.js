// controllers/adminAds.controller.js
import { pool } from "../config/db.js";
import { buildAdHtml } from "../utils/buildAdHtml.js";

export const getAllAds = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT
      id,
      slot_id,
      width,
      height,
      image_url,
      img_class,
      link_url,
      published,
      view_image
     FROM ad_slots
     ORDER BY slot_id`,
  );

  res.json(rows);
};

export const updateAd = async (req, res) => {
  const { id } = req.params;
  const {
    width,
    height,
    image_url,
    img_class,
    link_url,
    published,
    view_image,
  } = req.body;

  const html_code = buildAdHtml({
    image_url,
    img_class,
    link_url,
  });

  await pool.query(
    `
    UPDATE ad_slots SET
      width = ?,
      height = ?,
      image_url = ?,
      img_class = ?,
      link_url = ?,
      html_code = ?,
      published = ?,
      view_image = ?,
      updated_at = NOW()
    WHERE id = ?
    `,
    [
      width,
      height,
      image_url,
      img_class,
      link_url,
      html_code,
      published,
      view_image,
      id,
    ],
  );

  res.json({ success: true });
};
export const createAd = async (req, res) => {
  try {
    const {
      slot_id,
      width,
      height,
      image_url,
      img_class,
      link_url,
      published,
      view_image,
    } = req.body;

    if (!slot_id) {
      return res.status(400).json({ error: "slot_id zorunlu" });
    }

    const html_code = buildAdHtml({
      image_url,
      img_class,
      link_url,
    });

    const [result] = await pool.query(
      `
      INSERT INTO ad_slots (
        slot_id,
        width,
        height,
        image_url,
        img_class,
        link_url,
        html_code,
        published,
        view_image,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `,
      [
        slot_id,
        width || null,
        height || null,
        image_url || null,
        img_class || null,
        link_url || null,
        html_code,
        published ? 1 : 0,
        view_image || null,
      ],
    );

    res.json({
      success: true,
      id: result.insertId,
    });
  } catch (err) {
    console.error("createAd error:", err);

    // duplicate slot_id vs.
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Bu slot_id zaten mevcut" });
    }

    res.status(500).json({ error: "Reklam oluşturulamadı" });
  }
};
export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM ad_slots WHERE id = ? LIMIT 1`,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reklam bulunamadı" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("deleteAd error:", err);
    res.status(500).json({ error: "Reklam silinemedi" });
  }
};
