// routes/reaction.routes.js
import express from "express";
import { optionalAuth } from "../middlewares/optionalAuth.js";
import {
  attachGuestReactions,
  getReactionsByBlog,
  toggleReaction,
} from "../controllers/reaction.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/attach-guest", requireAuth, attachGuestReactions);
router.get("/:blogId", getReactionsByBlog);
router.post("/:blogId", optionalAuth, toggleReaction);

export default router;
