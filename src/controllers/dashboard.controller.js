import { pool } from "../config/db.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [[blogCount]] = await pool.query(
      "SELECT COUNT(*) AS total FROM blogs",
    );

    const [[pendingComments]] = await pool.query(
      "SELECT COUNT(*) AS total FROM comments WHERE status = 'pending'",
    );

    const [[userCount]] = await pool.query(
      "SELECT COUNT(*) AS total FROM users",
    );

    res.json({
      blogs: blogCount.total,
      pendingComments: pendingComments.total,
      users: userCount.total,
    });
  } catch (e) {
    next(e);
  }
};
