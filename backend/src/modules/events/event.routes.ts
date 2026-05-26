import { Router } from "express";
import { createEvent, getAllEvents, deleteEvent } from "./event.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/role.middleware";

const router = Router();

// GET / — authenticate, get all events
router.get("/", authenticate, getAllEvents);

// POST / — authenticate, authorize SECRETARY or ADMIN, create event
router.post("/", authenticate, authorize(["SECRETARY", "ADMIN"]), createEvent);

// DELETE /:id — authenticate, authorize SECRETARY or ADMIN, delete event
router.delete("/:id", authenticate, authorize(["SECRETARY", "ADMIN"]), deleteEvent);

export default router;