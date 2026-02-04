import { pool } from "../config/db.js";

export const createProgram = async (req, res) => {
  const { goal, start_weight, target_weight, target_months, data, guest_id } =
    req.body;

  if (!goal || !start_weight || !target_weight || !data) {
    return res.status(400).json({ error: "Eksik veri" });
  }

  const userId = req.user?.id || null;

  const [result] = await pool.query(
    `
    INSERT INTO programs
    (user_id, guest_id, goal, start_weight, target_weight, target_months, data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      userId ? null : guest_id,
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
  const guestId = req.query.guest_id;
  const userId = req.user?.id;

  let query = `
    SELECT id, goal, start_weight, target_weight, target_months, created_at
    FROM programs
    WHERE
  `;

  let params = [];

  if (userId) {
    query += ` user_id = ? `;
    params.push(userId);
  } else if (guestId) {
    query += ` guest_id = ? `;
    params.push(guestId);
  } else {
    return res.json([]);
  }

  query += ` ORDER BY created_at DESC`;

  const [rows] = await pool.query(query, params);
  res.json(rows);
};

export const getProgramById = async (req, res) => {
  const { id } = req.params;
  const guestId = req.query.guest_id;
  const userId = req.user?.id;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM programs
    WHERE id = ?
    AND (
      (user_id IS NOT NULL AND user_id = ?)
      OR
      (guest_id IS NOT NULL AND guest_id = ?)
    )
    LIMIT 1
    `,
    [id, userId || null, guestId || null],
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
  const guestId = req.query.guest_id;
  const userId = req.user?.id || null;

  if (!userId && !guestId) {
    return res.status(400).json({ error: "Yetkisiz istek" });
  }

  const [result] = await pool.query(
    `
    DELETE FROM programs
    WHERE id = ?
    AND (
      (user_id IS NOT NULL AND user_id = ?)
      OR
      (guest_id IS NOT NULL AND guest_id = ?)
    )
    `,
    [id, userId, guestId],
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Program bulunamadı" });
  }

  res.json({ success: true });
};

// controllers/program.controller.js
export const attachGuestPrograms = async (req, res) => {
  const { guest_id } = req.body;

  if (!guest_id) {
    return res.status(400).json({ error: "guest_id gerekli" });
  }

  await pool.query(
    `
    UPDATE programs
    SET user_id = ?, guest_id = NULL
    WHERE guest_id = ?
    `,
    [req.user.id, guest_id],
  );

  res.json({ success: true });
};
