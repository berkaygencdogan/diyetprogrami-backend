import express from "express";
import {
  createComment,
  getApprovedComments,
  getAllCommentsAdmin,
  updateCommentAdmin,
} from "../controllers/comment.controller.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

// Public
router.get("/:blogId", getApprovedComments);
router.post("/", createComment);

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

export default router;
