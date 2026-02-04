// utils/settings.js
import { pool } from "../config/db.js";

export const getSetting = async (key) => {
  const [[row]] = await pool.query(
    "SELECT value FROM settings WHERE `key` = ? LIMIT 1",
    [key],
  );
  return row?.value || null;
};
