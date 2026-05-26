import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import {
  createSermon,
  getAllSermons,
  getSermonById,
  updateSermon,
  updateSermonStatus,
  deleteSermon,
} from "./sermon.controller";

const router = Router();

// Public routes (authenticated users)
router.get("/", authenticate, getAllSermons);
router.get("/:id", authenticate, getSermonById);

// Protected routes (PASTOR and ADMIN only)
router.post("/", authenticate, authorize(["PASTOR", "ADMIN"]), createSermon);
router.patch("/:id", authenticate, authorize(["PASTOR", "ADMIN"]), updateSermon);
router.patch("/:id/status", authenticate, authorize(["PASTOR", "ADMIN"]), updateSermonStatus);
router.delete("/:id", authenticate, authorize(["PASTOR", "ADMIN"]), deleteSermon);

export default router;