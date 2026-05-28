import { Router } from "express";
import { create, getAll, getById, update, remove } from "./sermon-note.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticate); // All routes require authentication

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;