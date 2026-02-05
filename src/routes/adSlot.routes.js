// routes/ads.routes.js
import express from "express";
import { getAdBySlotId } from "../controllers/adSlot.controller.js";

const router = express.Router();

router.get("/slot/:slotId", getAdBySlotId);

export default router;
