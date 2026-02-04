import express from "express";
import {
  createProgram,
  getMyPrograms,
  getProgramById,
  deleteProgram,
  attachGuestPrograms,
} from "../controllers/program.controller.js";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import { requireAuth } from "../middlewares/auth.js";
import { checkProgramAccess } from "../middlewares/checkProgramAccess.js";

const router = express.Router();

router.get("/", optionalAuth, checkProgramAccess, getMyPrograms);

router.get("/:id", optionalAuth, checkProgramAccess, getProgramById);

router.post("/", optionalAuth, checkProgramAccess, createProgram);

router.post("/attach-guest", requireAuth, attachGuestPrograms);

// sil
router.delete("/:id", optionalAuth, deleteProgram);

export default router;
