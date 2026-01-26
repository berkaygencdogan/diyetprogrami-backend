import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import {
  toggleFavorite,
  getFavorites,
  checkFavorite,
} from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/:blogId", requireAuth, toggleFavorite);
router.get("/me", requireAuth, getFavorites);
router.get("/check/:blogId", requireAuth, checkFavorite);

export default router;
