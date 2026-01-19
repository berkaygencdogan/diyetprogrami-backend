import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  getBlogsAdmin,
  getBlogByIdAdmin,
} from "../controllers/blog.controller.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

// Public
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin / Editor
router.get("/admin/all", auth, allowRoles("editor", "admin"), getBlogsAdmin);

router.post("/admin", auth, allowRoles("editor", "admin"), createBlog);

router.put("/admin/:id", auth, allowRoles("editor", "admin"), updateBlog);
router.get("/admin/:id", auth, allowRoles("editor", "admin"), getBlogByIdAdmin);

export default router;
