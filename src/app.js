import express from "express";
import cors from "cors";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminBlogRoutes from "./routes/adminBlog.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import dietRoutes from "./routes/diet.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import sliderRoutes from "./routes/slider.routes.js";
import adminUsersRoutes from "./routes/admin.users.routes.js";
import programRoutes from "./routes/program.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import reactionRoutes from "./routes/reaction.route.js";
import tagRoutes from "./routes/tag.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import seoRoutes from "./routes/seo.routes.js";
import adsRoutes from "./routes/adSlot.routes.js";
import adminAdsRoutes from "./routes/adminAds.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads klasörünü public yap

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/blog", blogRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin", adminUsersRoutes);
app.use("/api/sliders", sliderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/admin/blog", adminBlogRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/admin/ads", adminAdsRoutes);

export default app;
