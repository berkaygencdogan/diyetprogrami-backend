import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/users", requireAuth, requireRole(["admin"]), getAllUsers);
router.put("/users/:id", requireAuth, requireRole(["admin"]), updateUser);
router.delete("/users/:id", requireAuth, requireRole(["admin"]), deleteUser);

export default router;
