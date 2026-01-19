import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.get(
  "/dashboard",
  auth,
  allowRoles("admin", "editor"),
  getDashboardStats,
);

export default router;
