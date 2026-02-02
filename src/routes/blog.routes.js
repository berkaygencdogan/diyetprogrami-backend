import express from "express";
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  getBlogsAdmin,
  getBlogByIdAdmin,
  getBlogsByCategory,
  getLatestBlogs,
  searchBlogs,
  incrementBlogViews,
  getPopularBlogs,
  getRecommendedBlogs,
  getRelatedBlogsByTags,
} from "../controllers/blog.controller.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/admin/all", auth, allowRoles("editor", "admin"), getBlogsAdmin);
router.post("/admin", auth, allowRoles("editor", "admin"), createBlog);
router.put("/admin/:id", auth, allowRoles("editor", "admin"), updateBlog);
router.get("/admin/:id", auth, allowRoles("editor", "admin"), getBlogByIdAdmin);
router.get("/search", searchBlogs);
router.get("/popular", getPopularBlogs);
router.get("/recommended", getRecommendedBlogs);
router.get("/latest", getLatestBlogs);
router.get("/related/:id", getRelatedBlogsByTags);
router.post("/:id/view", incrementBlogViews);
router.get("/category/:slug", getBlogsByCategory);

router.get("/:slug", getBlogBySlug);

export default router;
