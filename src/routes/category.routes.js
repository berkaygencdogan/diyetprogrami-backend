import express from "express";
import { getCategories } from "../controllers/category.Controller.js";

const router = express.Router();
console.log("girdi");

router.get("/", getCategories);

export default router;
