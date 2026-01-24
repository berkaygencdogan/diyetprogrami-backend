import express from "express";
import {
  getSliders,
  createSlider,
  deleteSlider,
} from "../controllers/slider.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// public
router.get("/", getSliders);

// admin
router.post("/", requireAuth, requireRole(["admin"]), createSlider);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteSlider);

export default router;
