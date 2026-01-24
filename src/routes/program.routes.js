import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  saveGoal,
  getMyProgram,
  saveMeasurement,
} from "../controllers/program.controller.js";

const router = express.Router();

router.post("/goal", requireAuth, saveGoal);
router.get("/me", requireAuth, getMyProgram);
router.post("/measure", requireAuth, saveMeasurement);

export default router;
