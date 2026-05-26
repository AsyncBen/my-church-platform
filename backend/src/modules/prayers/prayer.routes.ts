import { Router } from "express";
import { createPrayer, getAllPrayers, prayForRequest, deletePrayer } from "./prayer.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

// GET / — authenticate, get all prayers
router.get("/", authenticate, getAllPrayers);

// POST / — authenticate, create prayer
router.post("/", authenticate, createPrayer);

// PATCH /:id/pray — authenticate, pray for request
router.patch("/:id/pray", authenticate, prayForRequest);

// DELETE /:id — authenticate, delete prayer
router.delete("/:id", authenticate, deletePrayer);

export default router;