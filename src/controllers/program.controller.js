import { pool } from "../config/db.js";

export const createProgram = async (req, res) => {
  const { goal, start_weight, target_weight, target_months, data } = req.body;
  if (!goal || !start_weight || !target_weight || !data) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  const [result] = await pool.query(
    `
    INSERT INTO programs
    (user_id, goal, start_weight, target_weight, target_months, data)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      req.user.id,
      goal,
      start_weight,
      target_weight,
      target_months || null,
      JSON.stringify(data),
    ],
  );
  res.json({ id: result.insertId });
};

export const getMyPrograms = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(
    `
    SELECT id, goal, start_weight, target_weight, target_months, created_at
    FROM programs
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
  );

  res.json(rows);
};

export const getProgramById = async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM programs
    WHERE id = ? AND user_id = ?
    LIMIT 1
    `,
    [id, req.user.id],
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Program bulunamadı" });
  }

  const program = rows[0];

  program.data =
    typeof program.data === "string" ? JSON.parse(program.data) : program.data;

  res.json(program);
};

export const deleteProgram = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    `
    DELETE FROM programs
    WHERE id = ? AND user_id = ?
    `,
    [id, req.user.id],
  );

  res.json({ success: true });
};
