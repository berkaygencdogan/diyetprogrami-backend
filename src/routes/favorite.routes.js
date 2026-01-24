import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  toggleFavorite,
  getFavorites,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/:blogId", requireAuth, toggleFavorite);
router.get("/", requireAuth, getFavorites);

export default router;
