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

router.get("/home", getHomeComments);

router.post("/", createComment);

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

router.patch(
  "/admin/:id/home",
  requireAuth,
  requireRole(["admin"]),
  toggleHomeComment,
);

router.get("/:blogId", getApprovedComments);

export default router;
