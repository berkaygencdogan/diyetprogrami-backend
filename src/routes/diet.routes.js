import express from "express";
import {
  calculatePlan,
  calculateFood,
  calculateMultipleFoods,
  checkPlanCompatibility,
  suggestFoodsByMacro,
  evaluateDiet,
} from "../controllers/diet.controller.js";

const router = express.Router();

/* 🧮 PLAN */
router.post("/plan", calculatePlan);

/* 🍗 BESİN */
router.post("/food", calculateFood);
router.post("/foods", calculateMultipleFoods);

/* 📊 ANALİZ */
router.post("/check", checkPlanCompatibility);
router.post("/suggest", suggestFoodsByMacro);
router.post("/evaluate", evaluateDiet);

export default router;
