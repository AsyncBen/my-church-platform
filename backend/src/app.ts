import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import sermonRoutes from "./modules/sermons/sermon.routes";
import announcementRoutes from "./modules/announcements/announcement.routes";
// Future: import memberRoutes from "./modules/members/member.routes";

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/sermons", sermonRoutes);
app.use("/announcements", announcementRoutes);
// app.use("/members", memberRoutes);  ← wire up next modules here

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;