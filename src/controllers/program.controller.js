import { pool } from "../config/db.js";

/* 🎯 HEDEF KAYDET */
export const saveGoal = async (req, res, next) => {
  try {
    const { goal, target_weight, months, summary } = req.body;

    await pool.query(
      `
      INSERT INTO user_goals
      (user_id, goal, target_weight, months, daily_calories, protein, fat, carb)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        goal,
        target_weight || null,
        months || null,
        summary.dailyCalories,
        summary.macros.protein,
        summary.macros.fat,
        summary.macros.carb,
      ],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

/* 📊 PROGRAMIM */
export const getMyProgram = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM user_goals
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [req.user.id],
    );

    res.json(rows[0] || null);
  } catch (e) {
    next(e);
  }
};

/* 📏 ÖLÇÜM KAYDET */
export const saveMeasurement = async (req, res, next) => {
  try {
    const { height, weight, age, gender } = req.body;

    await pool.query(
      `
      INSERT INTO user_measurements
      (user_id, height, weight, age, gender)
      VALUES (?, ?, ?, ?, ?)
      `,
      [req.user.id, height, weight, age, gender],
    );

    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};
