import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";

import { upload } from "../middlewares/upload.js";
import { auth } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const execFileAsync = promisify(execFile);
const router = express.Router();

router.post(
  "/image",
  auth,
  allowRoles("editor", "admin"),
  upload.single("file"),
  async (req, res, next) => {
    try {
      const inputPath = req.file.path;
      const outputDir = path.join(process.cwd(), "uploads/blog");

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputFilename = crypto.randomUUID() + ".webp";
      const outputPath = path.join(outputDir, outputFilename);

      await execFileAsync("convert", [
        inputPath,
        "-resize",
        "1600x>", // width max 1600, büyütme yok
        "-quality",
        "80",
        outputPath,
      ]);

      fs.unlinkSync(inputPath);

      res.json({
        location: `/uploads/blog/${outputFilename}`,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
