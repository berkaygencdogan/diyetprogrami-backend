import express from "express";
import {
  getTags,
  createTag,
  getBlogsByTag,
  getTagBySlug,
} from "../controllers/tag.controller.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.get("/", getTags);
router.post("/", auth, allowRoles("admin", "editor"), createTag);
router.get("/:slug", getTagBySlug);
router.get("/:slug/blogs", getBlogsByTag);

export default router;
