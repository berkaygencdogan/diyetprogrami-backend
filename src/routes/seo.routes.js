import express from "express";
import { renderSeo } from "../controllers/seo.controller.js";

const router = express.Router();

// Örnek:
// /api/seo/render?page_key=blog_detail&slug=abc
router.get("/render", renderSeo);

export default router;
