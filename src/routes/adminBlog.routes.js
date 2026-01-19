import express from "express";
import {
  getAdminBlogById,
  updateAdminBlog,
} from "../controllers/adminBlog.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

// 🔐 ADMIN / EDITOR BLOG GET (EDIT İÇİN)
router.get(
  "/:id",
  requireAuth,
  requireRole(["admin", "editor"]),
  getAdminBlogById,
);

// 🔐 BLOG UPDATE
router.put(
  "/:id",
  requireAuth,
  requireRole(["admin", "editor"]),
  updateAdminBlog,
);

export default router;
