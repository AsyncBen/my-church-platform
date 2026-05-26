import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import sermonRoutes from "./modules/sermons/sermon.routes";
import announcementRoutes from "./modules/announcements/announcement.routes";
import givingRoutes from "./modules/giving/giving.routes";
import eventRoutes from "./modules/events/event.routes";
import prayerRoutes from "./modules/prayers/prayer.routes";
import feedRoutes from "./modules/feed/feed.routes";

import uploadRoutes from "./modules/upload/upload.routes";
import path from "path";
// Future: import memberRoutes from "./modules/members/member.routes";

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/sermons", sermonRoutes);
app.use("/announcements", announcementRoutes);
app.use("/giving", givingRoutes);
app.use("/events", eventRoutes);
app.use("/prayers", prayerRoutes);
app.use("/feed", feedRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// app.use("/members", memberRoutes);  ← wire up next modules here

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;