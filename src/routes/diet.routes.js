import express from "express";
import { generateGoalBasedDietPlanFromUser } from "../controllers/diet.controller.js";

const router = express.Router();

router.post("/goal-plan", generateGoalBasedDietPlanFromUser);

export default router;
