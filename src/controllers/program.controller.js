import { pool } from "../config/db.js";

export const createProgram = async (req, res) => {
  const userId = req.user.id;
  const { summary, plan } = req.body;

  if (!summary || !plan) {
    return res.status(400).json({ error: "Eksik program verisi" });
  }

  const [result] = await pool.query(
    `
    INSERT INTO programs (user_id, goal, start_weight, target_weight, months, summary, plan)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      summary.goal,
      summary.startWeight || null,
      summary.targetKg || null,
      summary.months || null,
      JSON.stringify(summary),
      JSON.stringify(plan),
    ],
  );

  res.json({ id: result.insertId });
};

export const getMyPrograms = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(
    `
    SELECT id, goal, created_at
    FROM programs
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
  );

  res.json(rows);
};

export const getProgramById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM programs
    WHERE id = ? AND user_id = ?
    `,
    [id, userId],
  );

  if (!rows.length) {
    return res.status(404).json({ error: "Program bulunamadı" });
  }

  const program = rows[0];
  program.summary = JSON.parse(program.summary);
  program.plan = JSON.parse(program.plan);

  res.json(program);
};

export const deleteProgram = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  await pool.query(
    `
    DELETE FROM programs
    WHERE id = ? AND user_id = ?
    `,
    [id, userId],
  );

  res.json({ success: true });
};
