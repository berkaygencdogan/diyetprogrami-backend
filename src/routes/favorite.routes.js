import express from "express";
import { optionalAuth } from "../middlewares/optionalAuth.js";

import {
  toggleFavorite,
  getFavorites,
  checkFavorite,
  attachGuestFavorites,
} from "../controllers/favorite.controller.js";
import { checkFavoriAccess } from "../middlewares/checkProgramAccess.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/attach-guest", requireAuth, attachGuestFavorites);
router.post("/:blogId", optionalAuth, checkFavoriAccess, toggleFavorite);
router.get("/me", optionalAuth, checkFavoriAccess, getFavorites);
router.get("/check/:blogId", optionalAuth, checkFavoriAccess, checkFavorite);

export default router;
