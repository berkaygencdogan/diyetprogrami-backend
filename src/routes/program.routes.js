import express from "express";
import {
  createProgram,
  getMyPrograms,
  getProgramById,
  deleteProgram,
} from "../controllers/program.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// oluştur
router.post("/", requireAuth, createProgram);

// liste
router.get("/me", requireAuth, getMyPrograms);

// detay
router.get("/:id", requireAuth, getProgramById);

// sil
router.delete("/:id", requireAuth, deleteProgram);

export default router;
