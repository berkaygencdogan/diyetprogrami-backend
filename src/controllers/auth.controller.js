import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNormalized = email.trim().toLowerCase();

    const [rows] = await pool.query(
      "SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1",
      [emailNormalized],
    );

    if (!rows.length) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı" });
    }

    const user = rows[0];

    // 🔒 Google ile oluşturulmuş hesap koruması
    if (!user.password) {
      return res.status(401).json({
        error: "Bu hesap Google ile oluşturulmuş. Şifre ile giriş yapılamaz.",
      });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET tanımlı değil");
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

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

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Eksik bilgi" });
    }

    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (exists.length) {
      return res.status(400).json({ error: "Bu email zaten kayıtlı" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users (email, password, role)
      VALUES (?, ?, 'user')
      `,
      [email, hashed],
    );

    return res.json({ success: true });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
