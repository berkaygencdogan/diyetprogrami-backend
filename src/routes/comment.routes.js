import express from "express";
import {
  createComment,
  getApprovedComments,
  getAllCommentsAdmin,
  updateCommentAdmin,
  getHomeComments,
  toggleHomeComment,
} from "../controllers/comment.controller.js";
import { auth, requireAuth, requireRole } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

// ✅ PUBLIC – HOME YORUMLARI (EN ÜSTE)
router.get("/home", getHomeComments);

// Public
router.post("/", createComment);

// ⚠️ PARAMETRELİ ROUTE EN ALTA
router.get("/:blogId", getApprovedComments);

// Admin / Editor
router.get(
  "/admin/all",
  auth,
  allowRoles("editor", "admin"),
  getAllCommentsAdmin,
);

router.put(
  "/admin/:id",
  auth,
  allowRoles("editor", "admin"),
  updateCommentAdmin,
);

// Admin – home toggle
router.patch(
  "/:id/home",
  requireAuth,
  requireRole(["admin"]),
  toggleHomeComment,
);

export default router;
