import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ user var mı
    const [rows] = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }

    const user = rows[0];

    // 2️⃣ şifre doğru mu (KRİTİK SATIR)
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }

    // 3️⃣ token üret
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    // 4️⃣ response
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
