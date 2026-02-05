// controllers/adSlot.controller.js
import { pool } from "../config/db.js";

export const getAdBySlotId = async (req, res) => {
  try {
    const { slotId } = req.params;

    const [[ad]] = await pool.query(
      `
      SELECT
        slot_id,
        html_code,
        width,
        height,
        published
      FROM ad_slots
      WHERE slot_id = ?
      LIMIT 1
      `,
      [slotId],
    );

    if (!ad || ad.published !== 1 || !ad.html_code) {
      return res.json(null);
    }

    res.json(ad);
  } catch (err) {
    console.error("getAdBySlotId error:", err);
    res.status(500).json(null);
  }
};
