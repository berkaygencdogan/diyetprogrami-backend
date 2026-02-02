// routes/reaction.routes.js
import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  getReactionsByBlog,
  toggleReaction,
} from "../controllers/reaction.controller.js";

const router = express.Router();

router.get("/:blogId", getReactionsByBlog);
router.post("/:blogId", requireAuth, toggleReaction);

export default router;
