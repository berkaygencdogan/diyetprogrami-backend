// controllers/settings.controller.js
import { pool } from "../config/db.js";

export const getSettings = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM settings");

  const data = {};
  rows.forEach((r) => {
    data[r.key] = r.value;
  });

  res.json(data);
};

export const updateSetting = async (req, res) => {
  const { key, value } = req.body;

  await pool.query(
    `
    INSERT INTO settings (\`key\`, \`value\`)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE value = VALUES(value)
    `,
    [key, value],
  );

  res.json({ success: true });
};
