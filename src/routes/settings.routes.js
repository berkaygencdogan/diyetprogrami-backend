import express from "express";
import {
  getSettings,
  updateSetting,
} from "../controllers/settings.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// 🔓 PUBLIC (header, guest için)
router.get("/public", getSettings);

// 🔒 PANEL
router.get("/", requireAuth, getSettings);
router.post("/", requireAuth, updateSetting);

export default router;
