import express from "express";
import { upload } from "../middlewares/upload.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.post(
  "/image",
  auth,
  allowRoles("editor", "admin"),
  upload.single("file"),
  (req, res) => {
    res.json({
      location: `/uploads/blog/${req.file.filename}`,
    });
  },
);

export default router;
