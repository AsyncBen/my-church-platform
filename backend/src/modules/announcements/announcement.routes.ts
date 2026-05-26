import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";
import {
  createAnnouncement,
  getAllAnnouncements,
  sendAnnouncement,
  deleteAnnouncement,
} from "./announcement.controller";

const router = Router();

// Public route (authenticated users)
router.get("/", authenticate, getAllAnnouncements);

// Protected routes
router.post("/", authenticate, authorize(["PASTOR", "ADMIN", "SECRETARY"]), createAnnouncement);
router.patch("/:id/send", authenticate, authorize(["PASTOR", "ADMIN", "SECRETARY"]), sendAnnouncement);
router.delete("/:id", authenticate, authorize(["PASTOR", "ADMIN"]), deleteAnnouncement);

export default router;