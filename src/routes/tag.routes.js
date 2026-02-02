import express from "express";
import { getTags, createTag } from "../controllers/tag.controller.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.get("/", getTags);
router.post("/", auth, allowRoles("admin", "editor"), createTag);

export default router;
