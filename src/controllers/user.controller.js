import { pool } from "../config/db.js";

// LIST
export const getAllUsers = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC",
  );
  res.json(rows);
};

// UPDATE
export const updateUser = async (req, res) => {
  const { role } = req.body;

  await pool.query("UPDATE users SET role = ? WHERE id = ?", [
    role,
    req.params.id,
  ]);

  res.json({ success: true });
};

// DELETE
export const deleteUser = async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);

  res.json({ success: true });
};
